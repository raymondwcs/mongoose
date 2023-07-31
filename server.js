const dbName = 'test'
const mongouri = 'mongodb://172.17.0.2/test';
const mongoose = require('mongoose');
const async = require("async");

const contactSchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 1, maxlength: 20 },
    birthyear: { type: Number, min: 1900, max: 2100 },
    phone: [{
        type: { type: String, enum: ['office', 'home', 'mobile'], default: 'mobile', required: true },
        number: { type: String, required: true }
    }],
    email: String
});

const create = async () => {
    await mongoose.connect(mongouri);

    // create a contact
    const Contact = mongoose.model('contact', contactSchema);
    const raymond = new Contact({ name: 'Raymond', phone: [{ type: 'mobile', number: '12345678' }] });
    await raymond.save();

    return raymond;
}

const read = async () => {
    await mongoose.connect(mongouri);

    const Contact = mongoose.model('contact', contactSchema);
    const contacts = await Contact.find();

    return contacts;
}

const update = () => {
    mongoose.connect(mongouri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
        const Contact = mongoose.model('contact', contactSchema);

        Contact.findOne({ name: 'Raymond' }, (err, results) => {
            // change phone number
            results.phone[0].number = '19971997';
            results.save((err) => {
                if (err) throw err
                console.log('Contact updated!');
                db.close();
                read();
            })
        })
    })
}

const del = async () => {
    await mongoose.connect(mongouri);

    const Contact = mongoose.model('contact', contactSchema);
    const contacts = await Contact.deleteMany({});

    return 0;
}

create().then(() => {
    console.log('created one document');
    read().then((contacts) => {
        console.log(contacts);
        del().then(() => {
            console.log('deleted all documents');
            mongoose.disconnect();
        });
    })
});
