
var async = require('async');

import { ConfigParams, FilterParams, PagingParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { BeaconsHttpClientV1 } from '../../../src/clients/version1/BeaconsHttpClientV1';
import { BeaconsClientV1Fixture } from './BeaconsClientV1Fixture';

suite('BeaconsHttpClientV1_2', () => {

    let client: BeaconsHttpClientV1;
    let fixture: BeaconsClientV1Fixture;

    setup((done) => {

        let httpConfig = ConfigParams.fromTuples(
            'connection.protocol', 'http',
            'connection.port', 8080,
            'connection.host', 'localhost'
        );

        client = new BeaconsHttpClientV1();
        client.configure(httpConfig);
        let references = References.fromTuples(
            new Descriptor('beacons', 'client', 'http', 'default', '1.0'), client
        );

        client.setReferences(references);
        fixture = new BeaconsClientV1Fixture(client);
        client.open(null, done);

        var work = true;

        async.whilst( ()=> {
            return work
        },
            (callback) => {
                client.getBeacons('123', null, null, (error, page) => {
                    if (page.data.length == 0) {
                        work = false;
                        callback();
                    }
                    console.log('data', page.data)
                    var counter = 0

                    async.whilst(() => { 
                        return counter != page.data.length 
                    },
                        (cb) => {
                            
                            client.deleteBeaconById('123', page.data[counter].id, (err, beacon) => {
                                counter++;
                                cb();
                            })
                        },
                        (err) => {
                            callback(err);
                        }
                    )
                })
            }
        )

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