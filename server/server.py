from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_migrate import Migrate  # new import

app = Flask(__name__)
CORS(app)  # Enable CORS
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
db = SQLAlchemy(app)

migrate = Migrate(app, db)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return {'message': 'New user created'}, 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return {'message': 'Login failed'}, 401
    return {'message': 'Login successful'}, 200

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(500), nullable=True)  #TRY TO ADD THESE TWO FIELDS, IDK WHAT HAPPENED BUT DOESNT MIGRATE
    priority = db.Column(db.Integer, nullable=True)  # new field
    completed = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return {'tasks': [{'id': task.id, 'title': task.title, 'description': task.description, 'priority': task.priority, 'completed': task.completed, 'user_id': task.user_id} for task in tasks]}, 200
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    user_id = data['user_id'] if 'user_id' in data else None
    new_task = Task(title=data['title'], description=data.get('description', ''), priority=data.get('priority', 0), user_id=user_id)  # include new fields
    db.session.add(new_task)
    db.session.commit()
    return {'message': 'New task created', 'task': {'id': new_task.id, 'title': new_task.title, 'description': new_task.description, 'priority': new_task.priority, 'completed': new_task.completed, 'user_id': new_task.user_id}}, 201  # include new fields in the response

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    task = Task.query.get(task_id)
    task.title = data['title']
    task.description = data.get('description', task.description)  # update the description field
    task.priority = data.get('priority', task.priority)  # update the priority field
    task.completed = data['completed']
    db.session.commit()
    return {'message': 'Task updated'}, 200
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    db.session.delete(task)
    db.session.commit()
    return {'message': 'Task deleted'}, 200
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)