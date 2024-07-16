"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "Engineer",
    salary: 50000,
    equity: "0.5",
    companyHandle: "c1",
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
        ...newJob,
        id: expect.any(Number),
    });
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: testJobIds[0],
        title: "J1",
        salary: 10000,
        equity: "0.25",
        companyHandle: "c1",
        companyName: "C1",
      },
      {
        id: testJobIds[1],
        title: "J2",
        salary: 20000,
        equity: "0.5",
        companyHandle: "c2",
        companyName: "C2",
      },
      {
        id: testJobIds[2],
        title: "J3",
        salary: 30000,
        equity: "0",
        companyHandle: "c3",
        companyName: "C3",
      },
    ]);
  });

  test("works: minSalary filter", async function () {
    let jobs = await Job.findAll({ minSalary: 20000 });
    expect(jobs).toEqual([
      {
        id: testJobIds[1],
        title: "J2",
        salary: 20000,
        equity: "0.5",
        companyHandle: "c2",
        companyName: "C2",
      },
      {
        id: testJobIds[2],
        title: "J3",
        salary: 30000,
        equity: "0",
        companyHandle: "c3",
        companyName: "C3",
      },
    ]);
  });

  test("works: hasEquity filter", async function () {
    let jobs = await Job.findAll({ hasEquity: true });
    expect(jobs).toEqual([
      {
        id: testJobIds[0],
        title: "J1",
        salary: 10000,
        equity: "0.25",
        companyHandle: "c1",
        companyName: "C1",
      },
      {
        id: testJobIds[1],
        title: "J2",
        salary: 20000,
        equity: "0.5",
        companyHandle: "c2",
        companyName: "C2",
      },
    ]);
  });

  test("works: title filter", async function () {
    let jobs = await Job.findAll({ title: '3' });
    expect(jobs).toEqual([
      {
        id: testJobIds[2],
        title: "J3",
        salary: 30000,
        equity: "0",
        companyHandle: "c3",
        companyName: "C3",
      },
    ]);
  })

});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let job = await Job.get(testJobIds[0]);
    expect(job).toEqual({
      id: testJobIds[0],
      title: "J1",
      salary: 10000,
      equity: "0.25",
      company: {
        handle: "c1",
        name: "C1",
        numEmployees: 1,
        description: "Desc1",
        logoUrl: "http://c1.img",
      },
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(10000);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "New",
    salary: 50000,
    equity: "0.45",
  };

  test("works", async function () {
    let job = await Job.update(testJobIds[0], updateData);
    expect(job).toEqual({
      id: testJobIds[0],
      companyHandle: "c1",
      ...updateData,
    });
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      title: "New",
      salary: null,
      equity: null,
    };

    let job = await Job.update(testJobIds[0], updateDataSetNulls);
    expect(job).toEqual({
      id: testJobIds[0],
      companyHandle: "c1",
      ...updateDataSetNulls,
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(100000, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(testJobIds[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(testJobIds[0]);
    const res = await db.query(
        "SELECT id FROM jobs WHERE id=$1", [testJobIds[0]]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(100000);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
