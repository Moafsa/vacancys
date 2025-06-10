process.env.TS_JEST_DISABLE_VER_CHECKER = "true";
jest.setTimeout(10000);
if (!process.env.DEBUG) {
    console.log = jest.fn();
    console.debug = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
}
beforeEach(() => {
    jest.clearAllMocks();
});
afterAll(() => {
    jest.restoreAllMocks();
});
if (process.env.JEST_PROJECT === 'integration') {
    jest.setTimeout(15000);
}
//# sourceMappingURL=setup.js.map