const LightList = require("../models/light.model");
const BlubsReport = require("../models/reports.model");
exports.test = function (req, res) {
    res.send('Test api is working');
};

exports.light_create = function (req, res) {
    console.log('light_create');
    let lightList = new LightList(
        {
            color: req.body.color,
            size: req.body.size,
            volt: req.body.volt,
            lightTurnedOnTime: req.body.lightTurnedOnTime,
            lightTurnedOffTime: req.body.lightTurnedOffTime,
        }
    );
    lightList.save(function (err, data) {
        if (err) {
            return next(err);
        }
        console.log(data);
        let blubData = new BlubsReport(
            {
                id: data._id,
                blubOnOffHistory: []
            }
        );
        blubData.save((err) => {
            if (err) {
                return next(err);
            }
            console.log('Blub Report Created');
        })
        res.send('New Light Blub Created successfully')
    })
};
exports.light_all = function (req, res) {
    console.log('light_all');
    LightList.find(function (err, allBlubs) {
        if (err) return next(err);
        res.send(allBlubs);
    })
};
exports.light_filter = function (req, res) {
    console.log('light_filter');
    const filterBy = req.params.filterBy;
    console.log(filterBy);
    if (filterBy == 'onBlubs' || filterBy == 'offBlubs') {
        LightList.find({ isblubOn: { $eq: (filterBy == 'onBlubs') ? true : false } }, function (err, allBlubs) {
            if (err) return next(err);
            console.log(allBlubs);
            res.send(allBlubs);
        });
    } else {
        LightList.find(function (err, allBlubs) {
            if (err) return next(err);
            res.send(allBlubs);
        });
    }
};

exports.light_details = function (req, res) {
    console.log('light_details');
    LightList.findById(req.params.id, function (err, light) {
        if (err) return next(err);
        res.send(light);
    })
};

exports.light_update = function (req, res) {
    console.log('light_update');
    console.log(req.body);
    
    LightList.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true}, function (err, light) {
        if (err) return next(err);
        console.log(light);
        if (req.body.lightTurnedOffTime) {
            const blubOnOffValue = {
                lightTurnedOnTime: light.lightTurnedOnTime,
                lightTurnedOffTime: req.body.lightTurnedOffTime,
            }
            BlubsReport.update(
                { id: req.params.id },
                { $push: { blubOnOffHistory: blubOnOffValue } },
                function (err) {
                    if (err) {
                        return next(err);
                    }
                    console.log('Blub Report Updated');
                }
            );
        }
        res.send('light blub udpated.');
    });
};
exports.light_report = function (req, res) {
    console.log('light_report');
    BlubsReport.find(function (err, allBlubs) {
        if (err) return next(err);
        // console.log(allBlubs);

        blubsCost = [];
        for (var i = 0; i < allBlubs.length; i++) {
            const blubHistory = allBlubs[i].blubOnOffHistory;
            let cost = 0;
            for (var j = 0; j < blubHistory.length; j++) {
                const costCurrent = (new Date(blubHistory[j].lightTurnedOffTime).getTime() - new Date(blubHistory[j].lightTurnedOnTime).getTime()) / 3600000 * 500;
                if (costCurrent != NaN && costCurrent >= 0) {
                    cost += costCurrent;
                }
            }
            blubsCost.push({
                id: allBlubs[i].id,
                cost: parseFloat(cost).toFixed(2)
            });
        }
        console.log(blubsCost);
        res.send(blubsCost);
    })
};