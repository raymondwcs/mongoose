const async = require("async");
const util = require('util');
const mongoose = require('mongoose');
const dbName = 'test'
const mongouri = `mongodb://172.17.0.3/${dbName}`;

const maxNumberOfPhone = 10;
const phoneLimit = (val) => {
    return val.length <= maxNumberOfPhone && val.length > 0;
}

const contactSchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 1, maxlength: 20 },
    birthyear: { type: Number, min: 1900, max: 2100 },
    phone: {
        type: [{
            phoneType: { type: String, enum: ['office', 'home', 'mobile'], default: 'mobile', required: true },
            number: { type: String, required: true }
        }],
        validate: [phoneLimit, `Number of {PATH} exceeds the limit of ${maxNumberOfPhone}} or missing`]
    },
    email: String,
});

const create = async (contact) => {
    await mongoose.connect(mongouri);

    // create a contact
    const Contact = mongoose.model('contact', contactSchema);
    const raymond = new Contact(contact);
    const results = await raymond.save();

    return results;
}

const read = async () => {
    const Contact = mongoose.model('contact', contactSchema);
    const contacts = await Contact.find({ name: 'Raymond' });

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
    const Contact = mongoose.model('contact', contactSchema);
    const results = await Contact.deleteMany({});
    return results;
}

let contact = { name: 'Raymond', phone: [{ phoneType: 'mobile', number: '12345678' }] };

create(contact).then((results) => {
    console.log('created 1 document:')
    console.log(util.inspect(results, { showHidden: true, depth: null, colors: true }));
    read().then((results) => {
        console.log(`read ${results.length} document(s):`)
        console.log(util.inspect(results, { showHidden: true, depth: null, colors: true }));
        update().then(results => {
            console.log('document updated:');
            console.log(util.inspect(results, { showHidden: true, depth: null, colors: true }));
            del().then((results) => {
                console.log(`deleted ${results['deletedCount']} document(s)`);
                mongoose.disconnect().then(() => {
                    console.log('closed mongodb connection');
                    contact = { name: 'Mary' }
                    console.log('create 1 document without a phone!!!')
                    create(contact).then(results => {
                        console.log(util.inspect(results, { showHidden: true, depth: null, colors: true }));
                        mongoose.disconnect().then(() => console.log('closed mongodb connection')
                        );
                    });
                });
            });
        })
    })
}).catch(err => console.log(err));

