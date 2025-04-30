from datetime import datetime
from ..config import dbConfig
from pydantic import ValidationError
from flask import request, jsonify
from bson.objectid import ObjectId
from ..models import project_subtask_model


class TasksControllers:
    client = dbConfig.DB_Config()

    def Createtask(self):
        try:
            
            data = request.get_json()
            print(data,"data")
            validated_data = project_subtask_model.TaskRequest(**data)
            task_dict = validated_data.to_internal_dict()

            result = self.client.tasks.insert_one(task_dict)
            inserted_task = self.client.tasks.find_one({"_id": result.inserted_id})
            inserted_task["_id"] = str(inserted_task["_id"])

            return jsonify({
                "message": "Task created successfully",
                "task": inserted_task,
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


    def getTasks(self):
        try:
            # Query parameters
            page = int(request.args.get('page', 1))
            per_page = int(request.args.get('per_page', 10))
            search_term = request.args.get('search', '')
            status = request.args.get('status')
            # Build query filter
            query_filter = {}

            if search_term:
                query_filter['$or'] = [
                    {'name': {'$regex': search_term, '$options': 'i'}},
                    {'description': {'$regex': search_term, '$options': 'i'}},
                    {'status': {'$regex': search_term, '$options': 'i'}},
                ]

            if status and status.lower() != "all":
                query_filter['status'] = status.strip()

            
            # Pagination logic
            skip = (page - 1) * per_page
            total_tasks = self.client.tasks.count_documents(query_filter)

            # Querying the DB
            tasks = self.client.tasks.find(query_filter).sort("created_at", -1).skip(skip).limit(per_page)

            # Serialize and return
            serialized_tasks = []
            for task in tasks:
                task["_id"] = str(task["_id"])
                serialized_tasks.append(task)

            return jsonify({
                "tasks": serialized_tasks,
                "pagination": {
                    "total": total_tasks,
                    "page": page,
                    "per_page": per_page,
                    "total_pages": (total_tasks + per_page - 1) // per_page
                }
            }), 200

        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500


    def gettaskById(self, task_id):
        try:
            task = self.client.tasks.find_one({"_id": ObjectId(task_id)})
            if not task:
                return jsonify({"message": "Task not found"}), 404
            task["_id"] = str(task["_id"])
            return jsonify(task), 200
        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500

    def deletetaskById(self, task_id):
        try:
            result = self.client.tasks.delete_one({"_id": ObjectId(task_id)})
            if result.deleted_count == 0:
                return jsonify({"message": "Task not found"}), 404
            return jsonify({"message": "Task deleted successfully"}), 200
        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500

    def updatetaskById(self, task_id):
        try:
            data = request.get_json()
            validated_data = project_subtask_model.TaskRequest(**data)
            update_data = validated_data.to_internal_dict()

            result = self.client.tasks.update_one(
                {"_id": ObjectId(task_id)},
                {"$set": update_data}
            )

            if result.matched_count == 0:
                return jsonify({"message": "Task not found"}), 404

            updated_task = self.client.tasks.find_one({"_id": ObjectId(task_id)})
            updated_task["_id"] = str(updated_task["_id"])
            return jsonify({
                "message": "Task updated successfully",
                "task": updated_task,
                "statusCode": 200
            }), 200
        except ValidationError as e:
            return jsonify({"errors": e.errors()}), 400
        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500
