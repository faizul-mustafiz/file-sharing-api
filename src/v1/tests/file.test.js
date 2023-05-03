const { join } = require('path');
const { baseRoute } = require('../configs/app.config');
/**
 * * import chai, chai-http dependencies
 * * also inject server for mocha to run tests
 * * import should aggregator from chai
 * * import expect aggregator form chai
 * * use chai-http with chai to perform http request
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index');
const { deleteTestDataFromRedis } = require('../helpers/redis.helper');
const { provider } = require('../configs/file.config');
const Provider = require('../enums/provider.enum');
const should = chai.should();
chai.use(chaiHttp);

/**
 * * global variables needed for the entire test file
 */
let imageFilePath = '';
let imageFileActualName = '';
let imageFileMimeType = '';
let publicKey = '';
let privateKey = '';

/**
 * * all global variable reset method
 */
const resetAllTestVariables = () => {
  imageFilePath = '';
  imageFileActualName = '';
  imageFileMimeType = '';
  publicKey = '';
  privateKey = '';
};

describe('File Controller tests', () => {
  /**
   * @before will run at the start of the test cases
   */
  before((done) => {
    imageFilePath = join(__dirname, 'assets', 'image.png');
    imageFileActualName = 'image.png';
    imageFileMimeType = 'image/png';
    done();
  });
  /**
   * @after will run after the last test cases of the file
   * * here we reset all the global variables used for the entire test file
   */
  after((done) => {
    resetAllTestVariables();
    deleteTestDataFromRedis();
    done();
  });

  describe('[POST] /files | File Upload Process Test', () => {
    it('it should upload one file from assets', (done) => {
      chai
        .request(server)
        .post(`${baseRoute}/files`)
        .attach('file', imageFilePath)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have
            .property('message')
            .eql('File upload successfully');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          res.body.result.should.have
            .property('fileName')
            .eql(imageFileActualName);
          res.body.result.should.have.property('publicKey');
          res.body.result.should.have.property('privateKey');
          publicKey = res.body.result.publicKey;
          privateKey = res.body.result.privateKey;
          if (provider == Provider.local) {
            done();
          } else {
            setTimeout(done, 1000);
          }
        });
    });
  });

  describe('[GET] /files/{pubicKey} | File Download Process Test', () => {
    it('it should download one file from bucket', (done) => {
      chai
        .request(server)
        .get(`${baseRoute}/files/${publicKey}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.have.header('content-type');
          res.header['content-type'].should.eql(imageFileMimeType);
          res.should.have.header('content-disposition');
          res.header['content-disposition'].should.eql(
            `attachment; filename="${imageFileActualName}"`,
          );
          done();
        });
    });
  });

  describe('[DELETE] /files/{privateKey} | File Delete Process Test', () => {
    it('it should download one file from bucket', (done) => {
      chai
        .request(server)
        .delete(`${baseRoute}/files/${privateKey}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message').eql('File deleted');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          res.body.result.should.have
            .property('fileName')
            .eql(imageFileActualName);
          done();
        });
    });
  });
});
