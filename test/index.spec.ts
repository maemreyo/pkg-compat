import { expect } from "chai";
import sinon from "sinon";
import { findCompatibleVersion, NpmPeerResponseCache } from "../src/index";

describe("findCompatibleVersion", () => {
  const givenPackage = {
    name: "test-package",
    version: "1.2.3",
  };
  const targetPackageName = "target-package";

  let hasStub;
  let getStub;
  let setStub;

  beforeEach(() => {
    hasStub = sinon.stub(NpmPeerResponseCache, "has").returns(false);
    getStub = sinon.stub(NpmPeerResponseCache, "get").returns(undefined);
    setStub = sinon.stub(NpmPeerResponseCache, "set");
  });

  afterEach(() => {
    hasStub.restore();
    getStub.restore();
    setStub.restore();
  });

  it("should return cached result if cache hit", async () => {
    const cachedVersions = ["1.0.0", "2.0.0"];
    hasStub.returns(true);
    getStub.returns(cachedVersions);

    const result = await findCompatibleVersion(givenPackage, targetPackageName);
    console.log("result", result);

    expect(result).to.deep.equal(cachedVersions);
  });

  it("should fetch API and return compatible versions", async () => {
    const apiUrl = `https://www.npmpeer.dev/find?package=${givenPackage.name}&version=${givenPackage.version}&dep=${targetPackageName}`;
    const response = {
      status: 200,
      json: () =>
        Promise.resolve({
          content: [{ version: "1.0.0" }, { version: "2.0.0" }],
        }),
    } as Response;
    sinon.stub(global, "fetch").resolves(response);

    const result = await findCompatibleVersion(givenPackage, targetPackageName);
    expect(result).to.deep.equal(["1.0.0", "2.0.0"]);
    // const expectation = sinon.expectation(NpmPeerResponseCache.set);
    // expectation.to.have.been.calledWith(
    //   `${givenPackage.name}@${givenPackage.version}--${targetPackageName}`,
    //   ["1.0.0", "2.0.0"]
    // );
  });

  it("should throw error if API request fails", async () => {
    const apiUrl = `https://www.npmpeer.dev/find?package=${givenPackage.name}&version=${givenPackage.version}&dep=${targetPackageName}`;
    const response = {
      status: 500,
      json: () => Promise.reject(new Error("API error")),
    } as Response;
    sinon.stub(global, "fetch").resolves(response);
    try {
      await findCompatibleVersion(givenPackage, targetPackageName);
      expect.fail("should have thrown an error");
    } catch (error) {
      expect(error.message).to.equal("API error");
    }
  });
});
