from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base  = declarative_base()

class PostTag(Base):
    __tablename__ = 'post_tag'
    id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    tag_id = Column(Integer, ForeignKey('tags.id'), nullable=False)

    post = relationship('Posts', back_populates='post_tag')
    tag = relationship('Tags', back_populates='post_tag')

class CommentVote(Base):
    __tablename__ = 'comment_vote'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    comment_id = Column(Integer, ForeignKey('comments.id'), nullable=False)
    upvote = Column(Integer, default=0)
    downvote = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship('Users', back_populates='comment_vote')
    comment = relationship('Comments', back_populates='comment_vote')

class Posts(Base):
    __tablename__ = 'posts'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    image_url = Column(String)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship('Users', back_populates='posts', cascade='all, delete')
    post_tag = relationship('PostTag', back_populates='post', cascade='all, delete')
    post_vote = relationship('PostVote', back_populates='post', cascade='all, delete')
    comments = relationship('Comments', back_populates='post', cascade='all, delete')

class Tags(Base):
    __tablename__ = 'tags'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)

    post_tag = relationship('PostTag', back_populates='tag')

class PostVote(Base):
    __tablename__ = 'post_vote'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    post_id = Column(Integer, ForeignKey('posts.id'), nullable=False)
    upvote = Column(Integer, default=0)
    downvote = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship('Users', back_populates='post_vote')
    post = relationship('Posts', back_populates='post_vote')

class Comments(Base):
    __tablename__ = 'comments'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    post_id = Column(Integer, ForeignKey('posts.id'), nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship('Users', back_populates='comments')
    post = relationship('Posts', back_populates='comments')
    comment_vote = relationship('CommentVote', back_populates='comment')

class Users(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    classname = Column(String, nullable=False)
    grade = Column(String, nullable=False)
    avatar_url = Column(String)
    cover_image_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    posts = relationship('Posts', back_populates='user')
    post_vote = relationship('PostVote', back_populates='user')
    comments = relationship('Comments', back_populates='user')
    comment_vote = relationship('CommentVote', back_populates='user')

