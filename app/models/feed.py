from datetime import datetime, timedelta
from app.models.base_model import BaseModel
from app.models import db


class Feed(db.Model, BaseModel):

	__tablename__ = 'feeds'

	visible = ['id', 'message', 'user_id', 'attachment', 'created_at', 'updated_at', 'deleted_at']

	id = db.Column(db.Integer, primary_key=True)
	message = db.Column(db.Text)
	attachment = db.Column(db.String)
	user_id = db.Column(
		db.Integer,
		db.ForeignKey('users.id'),
		nullable=False
	)
	user = db.relationship('User')
	created_at = db.Column(db.DateTime)
	updated_at = db.Column(db.DateTime)
	deleted_at = db.Column(db.DateTime)
	