const { TestEnvironment } = require('jest-environment-jsdom');

module.exports = class DstEnvironment extends TestEnvironment {
  async setup() {
    await super.setup();
    this.originalTimezone = process.env.TZ;
    // Change Node's real timezone, not Jest's sandboxed process.env in setup-jest.js.
    process.env.TZ = 'America/New_York';
  }

  async teardown() {
    try {
      await super.teardown();
    } finally {
      if (this.originalTimezone === undefined) delete process.env.TZ;
      else process.env.TZ = this.originalTimezone;
    }
  }
};
