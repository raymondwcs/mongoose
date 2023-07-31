const async = require("async");
const util = require('util');
const mongoose = require('mongoose');
const dbName = 'test'
const mongouri = `mongodb://172.17.0.3/${dbName}`;


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
    const Contact = mongoose.model('contact', contactSchema);
    const contacts = await Contact.find();

    return contacts;
}

const update = async () => {
    const Contact = mongoose.model('contact', contactSchema);
    let raymond = await Contact.findOne({ name: 'Raymond' });
    raymond.phone[0].number = '19971997';
    await raymond.save();
    return raymond;
}

const del = async () => {
    // await mongoose.connect(mongouri);

    const Contact = mongoose.model('contact', contactSchema);
    const results = await Contact.deleteMany({});
    return results;
}

create().then((results) => {
    console.log('created 1 document');
    read().then((contacts) => {
        console.log(util.inspect(contacts, { showHidden: true, depth: null, colors: true }));
        update().then(results => {
            console.log('document updated:');
            console.log(util.inspect(results, { showHidden: true, depth: null, colors: true }));
            del().then((results) => {
                console.log(`deleted ${results['deletedCount']} document(s)`);
                mongoose.disconnect();
            });
        })
    })
}).catch(err => console.log(err));
