from datetime import datetime
from ..config import dbConfig
from pydantic import ValidationError
from flask import request, jsonify
from bson.objectid import ObjectId
from ..models import project_model
from ..models import project_subtask_model
from bson.son import SON

class ProjectsControllers:
    client = dbConfig.DB_Config()

    def CreateProject(self):
        try:
            data = request.get_json()
            validated_data = project_model.ProjectRequest(**data)
            project_dict = validated_data.to_internal_dict()

            result = self.client.projects.insert_one(project_dict)
            inserted_project = self.client.projects.find_one({"_id": result.inserted_id})
            inserted_project["_id"] = str(inserted_project["_id"])

            return jsonify({
                "message": "Project created successfully",
                "project": inserted_project,
                "stausCode": 201
            }), 201

        except ValidationError as e:
             return jsonify({
                "errors": [
                    {
                        "loc": err.get("loc"),
                        "msg": err.get("msg").replace("Value error, ", ""),
                        "type": err.get("type")
                    }
                    for err in e.errors()
                ]
            }), 400

        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500


    def getProjects(self):
        try:
            # Query parameters
            page = int(request.args.get('page', 1))
            per_page = int(request.args.get('per_page', 10))
            search_term = request.args.get('search', '')
            start_date = request.args.get('start_date')
            end_date = request.args.get('end_date')
            status = request.args.get('status')
            # Build query filter
            query_filter = {}

            if search_term:
                query_filter['$or'] = [
                    {'name': {'$regex': search_term, '$options': 'i'}},
                    {'description': {'$regex': search_term, '$options': 'i'}},
                    {'priority': {'$regex': search_term, '$options': 'i'}},
                    {'status': {'$regex': search_term, '$options': 'i'}},
                ]

            if status and status.lower() != "all":
                query_filter['status'] = status.strip()

            if start_date and end_date:
                query_filter['created_at'] = {
                    '$gte': datetime.strptime(start_date, '%Y-%m-%d'),
                    '$lte': datetime.strptime(end_date, '%Y-%m-%d')
                }
            elif start_date:
                query_filter['created_at'] = {
                    '$gte': datetime.strptime(start_date, '%Y-%m-%d')
                }
            elif end_date:
                query_filter['created_at'] = {
                    '$lte': datetime.strptime(end_date, '%Y-%m-%d')
                }

            # Pagination logic
            skip = (page - 1) * per_page

            total_projects = self.client.projects.count_documents(query_filter)

            # Querying the DB
            projects = self.client.projects.find(query_filter).sort("created_at", -1).skip(skip).limit(per_page)

            # Serialize and return
            serialized_projects = []
            for project in projects:
                project["_id"] = str(project["_id"])
                serialized_projects.append(project)

            return jsonify({
                "projects": serialized_projects,
                "pagination": {
                    "total": total_projects,
                    "page": page,
                    "per_page": per_page,
                    "total_pages": (total_projects + per_page - 1) // per_page
                }
            }), 200

        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500


    def getProjectById(self, project_id):
        try:
            project = self.client.projects.find_one({"_id": ObjectId(project_id)})
            if not project:
                return jsonify({"message": "Project not found"}), 404
            project["_id"] = str(project["_id"])
            return jsonify(project), 200
        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500

    def deleteProjectById(self, project_id):
        try:
            result = self.client.projects.delete_one({"_id": ObjectId(project_id)})
            if result.deleted_count == 0:
                return jsonify({"message": "Project not found"}), 404
            return jsonify({"message": "Project deleted successfully"}), 200
        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500

    def updateProjectById(self, project_id):
        try:
            data = request.get_json() or {}
            subtasks_data = data.get('subtasks', [])

            validated_data = project_model.ProjectRequest(**data)
            update_data = validated_data.to_internal_dict()

            # Subtasks Handling
            validated_subtasks = []
            if subtasks_data:
                for subtask in subtasks_data:
                    subtask_payload = {
                        "project_id": str(project_id),
                        "title": subtask.get("title", ""),
                        "description": subtask.get("description", ""),
                        "assign_to": subtask.get("assign_to", ""),  # Fix field name
                        "status": subtask.get("status", "To Do")  # Default status if not provided
                    }
                    print(subtask_payload, "subtask_payload")
                    subtask_obj = project_subtask_model.SubTaskRequest(**subtask_payload)
                    validated_subtasks.append(subtask_obj.to_internal_dict())

                update_data['subtasks'] = validated_subtasks
            else:
                update_data['subtasks'] = []

            result = self.client.projects.update_one(
                {"_id": ObjectId(project_id)},
                {"$set": update_data}
            )

            if result.matched_count == 0:
                return jsonify({"message": "Project not found"}), 404

            updated_project = self.client.projects.find_one({"_id": ObjectId(project_id)})
            updated_project["_id"] = str(updated_project["_id"])
            return jsonify({
                "message": "Project updated successfully",
                "project": updated_project,
                "statusCode": 200
            }), 200

        except ValidationError as e:
            return jsonify({
                "errors": [
                    {
                        "loc": err.get("loc"),
                        "msg": err.get("msg").replace("Value error, ", ""),
                        "type": err.get("type")
                    }
                    for err in e.errors()
                ]
            }), 400
        except Exception as e:
            print(e)
            return jsonify({"errors": str(e)}), 500




    def getDataForDashboard(self):
        try:
            # Total project count
            total_projects = self.client.projects.count_documents({})

            # Projects with "In Progress" status
            total_TodoProjects = self.client.projects.count_documents({"status": "In Progress"})

            # Projects with "Completed" status
            total_InProgressProjects = self.client.projects.count_documents({"status": "Completed"})

            # Total user count
            total_userCount = self.client.users.count_documents({})

            # Aggregation to get month-wise project count
            pipeline = [
                {
                    "$addFields": {
                        "startDateConverted": { "$toDate": "$start_date" }
                    }
                },
                {
                    "$project": {
                        "year": { "$year": "$startDateConverted" },
                        "month": { "$month": "$startDateConverted" }
                    }
                },
                {
                    "$group": {
                        "_id": { "year": "$year", "month": "$month" },
                        "projectCount": { "$sum": 1 }
                    }
                },
                {
                    "$sort": SON([("_id.year", 1), ("_id.month", 1)])
                }
            ]
            
            monthly_projects = list(self.client.projects.aggregate(pipeline))

            # Format the monthly project count
            monthwise_counts = [
                {
                    "year": project["_id"]["year"],
                    "month": project["_id"]["month"],
                    "projectCount": project["projectCount"]
                }
                for project in monthly_projects
            ]
            
            return jsonify({
                "projectCount": total_projects,
                "todoProjectCount": total_TodoProjects,
                "inProgressProjectCount": total_InProgressProjects,
                "userCount": total_userCount,
                "monthwiseProjectCount": monthwise_counts,  # Adding monthwise project count to the response
                "statusCode": 200
            }), 200
        except Exception as e:
            print(e)
            return jsonify({"errors": str(e)}), 500
