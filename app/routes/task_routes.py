from flask import Blueprint, request
from ..controllers import tasks_controller

tasks_blueprint = Blueprint("tasks", __name__)
controller = tasks_controller.TasksControllers()

@tasks_blueprint.route("/tasks", methods=["GET"])
def get_tasks():
    return controller.getTasks()

@tasks_blueprint.route('/tasks', methods=["POST"])
def create_task():
    return controller.Createtask()

@tasks_blueprint.route('/tasks/<string:task_id>', methods=["GET"])
def get_task_by_id(task_id):
    return controller.gettaskById(task_id)


@tasks_blueprint.route('/tasks/<string:task_id>', methods=["DELETE"])
def delete_task_by_id(task_id):
    return controller.deletetaskById(task_id)

@tasks_blueprint.route('/tasks/<string:task_id>', methods=["PUT"])
def update_task_by_id(task_id):
    return controller.updatetaskById(task_id)
