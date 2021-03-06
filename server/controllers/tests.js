const mongoose = require('mongoose');

const Test = require('../models/tests.model');
const {GenerateTest, Sort}  = require('./test_generator');

const getAll = async (req, res) => { 
    try {
        const Tests = await Test.find();
                
        res.status(200).json(Tests);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getOne = async (req, res) => { 
    const { id } = req.params;

    try {
        const test = await Test.findById(id);
        
        res.status(200).json(test);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const create = async (req, res) => {
    var { name, marks, questions, rules, scores, duration } = req.body;
    
    questions = Sort(questions);
    const newTest = new Test({ name, marks, questions, rules, scores, duration })

    try {
        await newTest.save();

        res.status(201).json(newTest );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const update = async (req, res) => {
    const { id } = req.params;
    const { name, marks, questions, rules, scores, duration } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No Test with id: ${id}`);

    const updatedTest = { name, marks, questions, rules, scores, duration, _id: id };

    await Test.findByIdAndUpdate(id, updatedTest, { new: true });

    res.json(updatedTest);
}

const deleteOne = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No Test with id: ${id}`);

    await Test.findByIdAndRemove(id);

    res.json({ message: "Test deleted successfully." });
}

const generate = async (req,res) => {
    const { id } = req.params;
    try {
        const test = await Test.findById(id);
        const questions_id =  GenerateTest(test.questions, test.rules);
        var generated_test = [];

        questions_id.forEach(id => { 
            generated_test = [...generated_test, test.questions[id]];
        });

        res.status(200).json(generated_test);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

module.exports = {getAll, getOne, create, update, deleteOne, generate};