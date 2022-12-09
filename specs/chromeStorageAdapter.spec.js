import { ChromeStorageAdapter } from "../refactoring/scripts/chromeStorageAdapter.js"

import * as chai from "chai";
import * as sinon from "sinon";

var expect = chai.expect;


// describe ("test Suit", function(){
//     it("test get all pomodoros method", function(){
//         // var mock_chrome_storage = sinon.mock(chrome.storage.local);
//         // var expectation = mock.expects("get");
//         // expectation.withArgs(null);
//         savePomodoro();
//         mock.verify();
//         // expect(savePomodoro()).to.be.equal(3);
//     });
// });

var chrome = {
  storage: {
    local: {
      set: function () { },
      get: function () { }
    }
  }
}

const pomoStub = {
  "121": {
    "date_of_execution": "2022-12-04",
    "is_completed": false,
    "notes": "notes",
    "tags": "tags",
    "time_taken": 4,
    "title": "title_121"
  },
  "122": {
    "date_of_execution": "2022-12-04",
    "is_completed": true,
    "notes": "notes",
    "tags": "tags",
    "time_taken": 4,
    "title": "title_122"
  }
}

describe('get All pomodoro', function () {
  var adapter = {};

  beforeEach(function () {
    adapter = new ChromeStorageAdapter(chrome.storage.local);
  });

  after(function () {
    chrome.storage.local.get.restore();
  });

  it('calls spy on storage on chrom storage get', function () {
    var spy = sinon.spy(chrome.storage.local, "get");
    adapter.getAllPomodoros();
    sinon.assert.calledOnce(spy);
  });
});



describe('get All pomodoro, spy on promise', function () {
  var adapter = {};

  beforeEach(function () {
    adapter = new ChromeStorageAdapter(chrome.storage.local);
  });

  it('calls spy on storage on chrome storage get All promise', function () {
    var spyPromise = sinon.spy(adapter, "getAllPomodorosPromise")
    adapter.getAllPomodoros();
    expect(spyPromise.calledOnce).to.be.true;
  });

});


describe('get All pomodoro, resolve the promise', function () {
  var adapter = {};

  beforeEach(function () {
    adapter = new ChromeStorageAdapter(chrome.storage.local);
  });

  it('calls stub on storage on chrome storage get all', async () => {
    var getAllStub = sinon.stub(adapter, "getAllPomodorosPromise").resolves(pomoStub);
    expect(await adapter.getAllPomodoros()).to.deep.equal(pomoStub);
  });

});