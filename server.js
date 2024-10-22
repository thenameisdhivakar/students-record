import express from 'express';

import mongoose from 'mongoose';

import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());

const mongoDBURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-db';
console.log('db connection: ', mongoDBURI);

mongoose.connect(mongoDBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    name: String,
    mail: String,
    feedback: String,
});

const userModel = mongoose.model('users', userSchema);

app.post('/students', (req, res) => {
    const formstudents = new userModel(req.body);
    formstudents.save()
        .then((students) => res.json(students))
        .catch(() => res.status(500).send('data error'))
});

app.get('/students', (req, res) => {
    userModel.find()
        .then((data) => res.json(data))
        .catch(() => res.status(500).send('error'))
})

app.delete('/students/:id', (req, res) => {
    const { id } = req.params;

    userModel.findByIdAndDelete(id)
        .then((deletedData) => {
            if (deletedData) {
                res.json({ message: 'Data successfully deleted', deletedData });
            } else {
                res.status(404).json({ message: 'Data not found' });
            }
        })
        .catch(() => res.status(500).send('Error deleting data'));
});

app.put('/students/:id', (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    userModel.findByIdAndUpdate(id, updatedData, { new: true })
        .then((data) => {
            if (data) {
                res.json({ message: 'Data successfully updated', data });
            } else {
                res.status(404).json({ message: 'Data not found' });
            }
        })
        .catch(() => res.status(500).send('Error updating data'));
});



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));