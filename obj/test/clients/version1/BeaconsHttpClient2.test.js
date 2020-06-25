"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const BeaconsHttpClientV1_1 = require("../../../src/clients/version1/BeaconsHttpClientV1");
const BeaconsClientV1Fixture_1 = require("./BeaconsClientV1Fixture");
suite('BeaconsHttpClientV1_2', () => {
    let client;
    let fixture;
    setup((done) => {
        let httpConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('connection.protocol', 'http', 'connection.port', 8080, 'connection.host', 'localhost');
        client = new BeaconsHttpClientV1_1.BeaconsHttpClientV1();
        client.configure(httpConfig);
        let references = pip_services3_commons_node_3.References.fromTuples(new pip_services3_commons_node_2.Descriptor('beacons', 'client', 'http', 'default', '1.0'), client);
        client.setReferences(references);
        fixture = new BeaconsClientV1Fixture_1.BeaconsClientV1Fixture(client);
        client.open(null, done);
        var work = true;
        async.whilst(() => {
            return work;
        }, (callback) => {
            client.getBeacons('123', null, null, (error, page) => {
                if (page.data.length == 0) {
                    work = false;
                    callback();
                }
                console.log('data', page.data);
                var counter = 0;
                async.whilst(() => {
                    return counter != page.data.length;
                }, (cb) => {
                    //console.log('ID:', page.data[counter].id);
                    client.deleteBeaconById('123', page.data[counter].id, (err, beacon) => {
                        counter++;
                        cb();
                    });
                }, (err) => {
                    callback(err);
                });
            });
        });
    });
    teardown((done) => {
        client.close(null, (err) => {
            done();
        });
    });
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });
    // test('Calculate Position', (done) => {
    //     fixture.testCalculatePosition(done);
    // });
});
//# sourceMappingURL=BeaconsHttpClient2.test.js.map