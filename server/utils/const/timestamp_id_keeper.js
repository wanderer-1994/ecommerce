const timestamp_ids = [Date.now()];
const getTimeStampId = () => {
    let new_timestamp = Date.now();
    let last_timestamp = timestamp_ids[timestamp_ids.length - 1];
    if(new_timestamp <= last_timestamp) new_timestamp = last_timestamp + 1;
    timestamp_ids.push(new_timestamp);
    timestamp_ids.shift();
    return new_timestamp;
}

module.exports = {
    timestamp_ids,
    getTimeStampId
}