from flask import Blueprint, request
from ..controllers import projects_controller

projects_blueprint = Blueprint("projects", __name__)
controller = projects_controller.ProjectsControllers()

@projects_blueprint.route("/projects", methods=["GET"])
def get_projects():
    return controller.getProjects()

@projects_blueprint.route('/projects', methods=["POST"])
def create_project():
    return controller.CreateProject()

@projects_blueprint.route('/projects/<string:project_id>', methods=["GET"])
def get_project_by_id(project_id):
    return controller.getProjectById(project_id)


@projects_blueprint.route('/projects/<string:project_id>', methods=["DELETE"])
def delete_project_by_id(project_id):
    return controller.deleteProjectById(project_id)

@projects_blueprint.route('/projects/<string:project_id>', methods=["PUT"])
def update_project_by_id(project_id):
    return controller.updateProjectById(project_id)

@projects_blueprint.route("/dashboardData", methods=["GET"])
def get_dashboardData():
    return controller.getDataForDashboard()
