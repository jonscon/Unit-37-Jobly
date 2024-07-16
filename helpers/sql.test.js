const db = require("../db.js");
const { sqlForPartialUpdate } = require("./sql");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require("../models/_testCommon");
const { BadRequestError } = require("../expressError.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** test user */
describe("user data", function() {
    const userData = {
        firstName: "Test",
        lastName: "User",
        email:"testuser@gmail.com",
        isAdmin: true
    };

    test("convert data correctly", function () {
        const { setCols, values } = sqlForPartialUpdate(
            userData,
            {
                firstName: "first_name",
                lastName: "last_name",
                isAdmin: "is_admin"
            });
        expect(setCols).toEqual(`"first_name"=$1, "last_name"=$2, "email"=$3, "is_admin"=$4`);
        expect(values).toEqual(["Test", "User", "testuser@gmail.com", true]);
    })

    test("no data to update", function () {
        const noData = {};

        try {
            const { setCols, values } = sqlForPartialUpdate(
                noData,
                {
                    firstName: "first_name",
                    lastName: "last_name",
                    isAdmin: "is_admin"
                });
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** test company */
describe("company data", function() {
    const companyData = {
        name: "Test",
        description: "Test Description",
        numEmployees: 15,
        logoUrl: "http://new.img",
    };

    test("convert data correctly", function () {
        const { setCols, values } = sqlForPartialUpdate(
            companyData,
            {
                numEmployees: "num_employees",
                logoUrl: "logo_url",
            });
        expect(setCols).toEqual(`"name"=$1, "description"=$2, "num_employees"=$3, "logo_url"=$4`);
        expect(values).toEqual(["Test", "Test Description", 15, "http://new.img"]);
    })

    test("no data to update", function () {
        const noData = {};

        try {
            const { setCols, values } = sqlForPartialUpdate(
                noData,
                {
                    numEmployees: "num_employees",
                    logoUrl: "logo_url",
                });
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});