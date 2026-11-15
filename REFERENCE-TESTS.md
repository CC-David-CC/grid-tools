# Owned original reference tests

These3 original test files belong to grid-tools because their imported source modules match this repository’s exact captured blobs. Current implementation files and assertions are unchanged. Import and proven fixture/resource URL locators are ported to this repository; no cross-repository private source imports or compatibility path shims are added.

Mechanical source-test baseline `02aa6697781840590290abf977ade1c815336d66`; merge `4e363c246053cf4b615634663f58fbec8f15a14b`. Private phase44 preserves earlier paths, explicit copy boundaries and source-to-result commit/ref maps. The locator-normalized complete AST is unchanged, not just selected assertions.

Run `npm run test:reference`. This is Node unit/reference qualification of the retained domain modules, not browser/worker/kernel/renderer/storage/authentication/human-agent acceptance. Current app hosting/build and shared-operation integration gates remain separately open.

Captured baseline and current port: 3 pass, 0 fail, 0 cancelled, 0 skipped across 3 reported Node subtests. Top-level assertion-only files count as one reported Node subtest, not individual assertions.
