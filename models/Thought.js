const { Schema, model } = require('mongoose');

const ThoughtSchema = new Schema(
  {

  }
);


const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;
