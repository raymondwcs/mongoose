const async = require("async");
const util = require('util');
const mongoose = require('mongoose');
const dbName = 'test'
const mongouri = `mongodb://172.17.0.3/${dbName}`;   // *** update this ****

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
        validate: [phoneLimit, `No {PATH} or more than ${maxNumberOfPhone}}!`]
    },
    email: String,
});

const create = async (contact) => {
    // await mongoose.connect(mongouri);

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
    raymond.phone[0].number = '19971997';   // new number
    results = await raymond.save();

    return results;
}

const del = async () => {
    const Contact = mongoose.model('contact', contactSchema);
    const results = await Contact.deleteMany({});

    return results;
}

const main = async () => {
    await mongoose.connect(mongouri);
    // create
    let contact = { name: 'Raymond', phone: [{ phoneType: 'mobile', number: '12345678' }] };
    results = await create(contact);
    console.log('created 1 document:')
    console.log(util.inspect(results, { showHidden: true, depth: null, colors: true }));
    // read
    results = await read();
    console.log(`read ${results.length} document(s):`);
    console.log(util.inspect(results, { showHidden: true, depth: null, colors: true }));
    // update
    results = await update()
    console.log(`updated 1 document:`)
    console.log(util.inspect(results, { showHidden: true, depth: null, colors: true }));
    // delete
    results = await del();
    console.log(`deleted ${results['deletedCount']} document(s)`);
    // create that fails!
    console.log('try to create 1 document that causes a validation error...')
    contact = { name: 'Mary' };   // no phone number!
    results = await create(contact).catch(err => console.log(err));
    // disconnect from MongoDB
    await mongoose.disconnect();
    console.log('end run.')
}

main();
