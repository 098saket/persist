import path from 'path';
import multer from 'multer';

import Student from '../models/student';
import college from '../models/college';
import school from '../models/school';

import {getSignature, updateDocument} from './utils';
import saveCSV from '../utils/save_csv';
import saveCollegeData from '../utils/save_csv_colleges_updated';
import saveTermData from '../utils/save_csv_term_data';
import saveApplicationData from '../utils/save_csv_applications';

var upload = multer({
    dest: 'uploads/'
});

// set disk storage
var storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },

    filename(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now());
    }
});

// configure multer middleware
var fileUpload = upload.fields([{
    name: 'file',
    maxCount: 1
}]);

export default (app) => {

    app.post('/studentPaginate', (req, res) => {
        const offset = req.body.offset;
        Student.paginate({}, {
            offset: offset,
            limit: 20
        }, function (err, result) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).send(result.docs);
        });
    });

    app.post('/upload/studentData', fileUpload, function (req, res) {
        const fileData = req.files.file[0];
        const filePath = path.join(fileData.destination, fileData.filename);

        saveCSV(filePath).then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
    });

    app.post('/upload/collegeData', fileUpload, function (req, res) {
        const fileData = req.files.file[0];
        const filePath = path.join(fileData.destination, fileData.filename);

        saveCollegeData(filePath).then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
    });

    app.post('/upload/termData', fileUpload, (req, res) => {
        const fileData = req.files.file[0];
        const filePath = path.join(fileData.destination, fileData.filename);

        saveTermData(filePath).then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).send(err);
        })
    });

    app.post('/upload/applicationData', fileUpload, function (req, res) {
        const fileData = req.files.file[0];
        const filePath = path.join(fileData.destination, fileData.filename);

        res.send('getting through ok')

        // saveApplicationData(filePath).then((data) => {
        //   res.status(200).send(data);
        // }).catch((err) => {
        //   console.log(err);
        //   res.status(500).send(err);
        // });
    });

    // main REST API for getting/adding/deleting/modifying student data
    app.route('/api/student/:osis')
        .get((req, res) => {
            Student.findOne({
                osis: req.params.osis
            }, (err, student) => {
                if (err) {
                    res.status(500).send(err);
                }
                console.log(student);
                res.status(200).json(student);
            });
        })
        .post((req, res) => {
            res.send('working on it');
        })
        .put((req, res) => {
            const student = req.body;
            Student.findOneAndUpdate({
                osis: student.osis
            }, {
                $set: student
            }, {
                new: true,
                runValidators: true
            }, (err, updatedStudent) => {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.status(200).send(updatedStudent);
            });
        })
        .delete((req, res) => {
            res.send('working on it');
        });

    app.route('/api/college/:fullName')
        .get((req, res) => {
            console.log(req.params.fullName);
            college.find({
                fullName: req.params.fullName
            }, (err, college) => {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.status(200).json(college);
            });
        })
        .post((req, res) => {
            res.send('working on it');
        })
        .put((req, res) => {

            const data = req.body;

            college.findOneAndUpdate({
                fullName: data.fullName
            }, {
                $set: data
            }, {
                new: true
            }, function (err, doc) {
                if (err) {
                    res.send({err: true});
                }
                res.send(doc);
            });
        })
        .delete((req, res) => {
            res.send('working on it');
        });

    // main routes for queries to students db
    app.get('/api/students', (req, res) => {

        let query = Student.find({});
        query.exec((err, students) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).json(students);
        });
    });

    // main route for to get colleges db
    app.get('/api/colleges', (req, res) => {

        let query = college.find({});
        query.exec((err, colleges) => {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(colleges);
        });
    });

    app.get('/api/schools', (req, res) => {

        let query = school.find({});
        query.exec((err, schools) => {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(schools);
        });
    });

    app.get('/sign-s3', (req, res) => {
        getSignature(req, res);
    });

    app.post('/update-document', (req, res) => {
        updateDocument(req, res);
    });

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/public/index.html'));
    });
};
