const request = require('supertest');
const app = require('../server');
const db = require('../config/db.config');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let http = require('http');

const server = http.createServer(app);

describe('User Endpoints', () => {
  it('should create a new user', async () => {
    const res = await request(app)
    .post('/api/user/signup')
    .send({
      username: 'manuel',
      email: 'manuel@dummy.com',
      password: 'manuel1234'
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('email');
    expect(res.body.email).toEqual('manuel@dummy.com');
  });

  it('should login a user', async () => {
    const res = await request(app)
    .post('/api/user/login')
    .send({
      email: 'admin@admin.com',
      password: 'admin'
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username');
    expect(res.body.username).toEqual('admin');
  });

  it('should update a user', async () => {
    const newEmail = 'manuelUpdated@dummy.com';
    const userResponse = await request(app)
    .post('/api/user/signup')
    .send({
      username: 'manuel2',
      email: 'manuel2@dummy.com',
      password: 'manuel1234'
    });

    const res = await request(app)
    .put(`/api/user/${userResponse.body.id}`)
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      email: newEmail,
    });
    expect(res.statusCode).toEqual(200);

    const userResponseUpdated = await request(app)
    .get(`/api/user/${userResponse.body.id}`)
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST);

    expect(userResponseUpdated.statusCode).toEqual(200);
    expect(userResponseUpdated.body.email).toEqual(newEmail);
  });

  it('should get all the users', async () => {
    const res = await request(app)
    .get('/api/user/all')
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST);

    expect(res.statusCode).toEqual(200);
  });

  it('should get a specific user', async () => {
    const userResponse = await request(app)
    .post('/api/user/signup')
    .send({
      username: 'manuel3',
      email: 'manuel3@dummy.com',
      password: 'manuel1234'
    });

    const res = await request(app)
    .get(`/api/user/${userResponse.body.id}`)
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST);

    expect(res.statusCode).toEqual(200);
  });

  it('should set a role for a specific user', async () => {
    const role = 'editor'
    const userResponse = await request(app)
    .post('/api/user/signup')
    .send({
      username: 'manuel4',
      email: 'manuel4@dummy.com',
      password: 'manuel1234'
    });

    const res = await request(app)
    .put(`/api/user/${userResponse.body.id}/set-role`)
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      role
    });

    expect(res.statusCode).toEqual(200);

    const userResponseUpdated = await request(app)
    .get(`/api/user/${userResponse.body.id}`)
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST);

    expect(userResponseUpdated.statusCode).toEqual(200);
    expect(userResponseUpdated.body.role).toEqual(role);
  });

  it('should delete a specific user', async () => {
    const userResponse = await request(app)
    .post('/api/user/signup')
    .send({
      username: 'manuel5',
      email: 'manuel5@dummy.com',
      password: 'manuel1234'
    });

    const res = await request(app)
    .delete(`/api/user/${userResponse.body.id}`)
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST);

    expect(res.statusCode).toEqual(200);
  });
});

describe('Post Endpoints', () => {
  it('should create a new post', async () => {
    const res = await request(app)
    .post('/api/post')
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      title: "Lorem Ipsum2",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      userId: 1
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title');
    expect(res.body.title).toEqual('Lorem Ipsum2');
  });

  it('should update a post', async () => {
    const newContent = 'content';
    const postResponse = await request(app)
    .post('/api/post')
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      title: "Lorem Ipsum2",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      userId: 1
    });

    const res = await request(app)
    .put(`/api/post/${postResponse.body.id}`)
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      content: newContent,
    });
    expect(res.statusCode).toEqual(200);

    const postResponseUpdated = await request(app)
    .get(`/api/post/${postResponse.body.id}`)
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST);

    expect(postResponseUpdated.statusCode).toEqual(200);
    expect(postResponseUpdated.body.content).toEqual(newContent);
  });

  it('should get all the posts', async () => {
    const res = await request(app)
    .get('/api/post/all')
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST);

    expect(res.statusCode).toEqual(200);
  });

  it('should get a specific post', async () => {
    const postResponse = await request(app)
    .post('/api/post')
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      title: "Lorem Ipsum2",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      userId: 1
    });

    const res = await request(app)
    .get(`/api/post/${postResponse.body.id}`)
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST);

    expect(res.statusCode).toEqual(200);
  });

  it('should delete a specific post', async () => {
    const postResponse = await request(app)
    .post('/api/post')
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      title: "Lorem Ipsum2",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      userId: 1
    });

    const res = await request(app)
    .delete(`/api/post/${postResponse.body.id}`)
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST);

    expect(res.statusCode).toEqual(200);
  });

  it('should add a up vote a post', async () => {
    const postResponse = await request(app)
    .post('/api/post')
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      title: "Lorem Ipsum2",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      userId: 1
    });

    const res = await request(app)
    .put(`/api/post/${postResponse.body.id}/up-vote/`)
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      qualification: 5,
    });

    expect(res.statusCode).toEqual(200);
  });

  it('should add a up vote a post and get the qualification', async () => {
    const postResponse = await request(app)
    .post('/api/post')
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      title: "Lorem Ipsum2",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      userId: 1
    });

    await request(app)
    .put(`/api/post/${postResponse.body.id}/up-vote/`)
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      qualification: 5,
    });;

    const res = await request(app)
    .get(`/api/post/${postResponse.body.id}/up-vote/`)
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST);

    expect(res.statusCode).toEqual(200);
    expect(res.body.qualification).toEqual(5);
  });
});

describe('Reviews Endpoints', () => {
  it('should create a new review', async () => {
    const postResponse = await request(app)
    .post('/api/post')
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      title: "Lorem Ipsum2",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      userId: 1
    });

    const res = await request(app)
    .post(`/api/review/${postResponse.body.id}`)
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      title: "review lorem impsu",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title');
    expect(res.body.title).toEqual('review lorem impsu');
  });

  it('should get all the reviews', async () => {
    const res = await request(app)
    .get('/api/review/all');

    expect(res.statusCode).toEqual(200);
  });

  it('should get a specific review', async () => {
    const postResponse = await request(app)
    .post('/api/post')
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      title: "Lorem Ipsum2",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
    });

    const reviewResponse = await request(app)
    .post(`/api/review/${postResponse.body.id}`)
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      title: "review lorem impsu",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    });

    const res = await request(app)
    .get(`/api/review/${reviewResponse.body.id}`)

    expect(res.statusCode).toEqual(200);
  });
});

describe('Post Logger Endpoints', () => {
  it('should get all the postLoggers', async () => {
    const res = await request(app)
    .get('/api/post-logger/all')
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST);

    expect(res.statusCode).toEqual(200);
  });

  it('should get a specific postLogger by post id', async () => {
    const postResponse = await request(app)
    .post('/api/post')
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      title: "Lorem Ipsum2",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
    });

    const res = await request(app)
    .get(`/api/post-logger/post/${postResponse.body.id}`)
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST);

    expect(res.statusCode).toEqual(200);
  });

  it('should get a specific postLogger by user id', async () => {
    const postResponse = await request(app)
    .post('/api/post')
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      title: "Lorem Ipsum2",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
    });

    const res = await request(app)
    .get('/api/post-logger/user/1')
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST);

    expect(res.statusCode).toEqual(200);
  });

  it('should get a specific postLogger by user id and post id', async () => {
    const postResponse = await request(app)
    .post('/api/post')
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST)
    .send({
      title: "Lorem Ipsum2",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
    });

    const res = await request(app)
    .get(`/api/post-logger/user/1/post/${postResponse.body.id}`)
    .set('x-access-token', process.env.ADMIN_TOKEN_TEST);

    expect(res.statusCode).toEqual(200);
  });
});
