from sqlalchemy import create_engine, MetaData, Table, select, inspect

engine = create_engine('sqlite:///data.db')
metadata = MetaData()

# Reflect the Task table doesnt really work 
task = Table('task', metadata, autoload_with=engine)

inspector = inspect(engine)

# Add the new columns
with engine.connect() as connection:
    columns = [column['name'] for column in inspector.get_columns('task')]
    if 'description' not in columns:
        connection.execute('ALTER TABLE task ADD COLUMN description TEXT;')
        print('Done adding description column')
    else: 
        print('Columns already exist')
    if 'priority' not in columns:
        connection.execute('ALTER TABLE task ADD COLUMN priority INTEGER;')
        print('Done adding description column')
    else: 
        print('Columns already exist')