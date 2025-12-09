# Changelog

## [1.1.0](https://github.com/CarlLee1983/ecpay-fulllogistics-node/compare/v1.0.0...v1.1.0) (2025-12-09)


### Features

* Add comprehensive unit tests for core actions, operations, mutations, queries, and parameters. ([c77d8cb](https://github.com/CarlLee1983/ecpay-fulllogistics-node/commit/c77d8cb71ddae416f4b60adebbc02a2c906a97f6))
* implement comprehensive ECPay logistics API operations, queries, mutations, and parameters. ([752a1ac](https://github.com/CarlLee1983/ecpay-fulllogistics-node/commit/752a1ac877ae4bcc1067069c20f173dc617fa3b5))
* initial SDK implementation with core modules ([cbc5bc8](https://github.com/CarlLee1983/ecpay-fulllogistics-node/commit/cbc5bc8ad7e380af974318117c1c74bff8d3d206))


### Bug Fixes

* flatten type definitions in build output and update package configuration to reflect new type paths. ([aad73ba](https://github.com/CarlLee1983/ecpay-fulllogistics-node/commit/aad73ba7ddef3df3dca066c398fc9abe0d5a925b))

## 1.0.0 (2025-12-09)

### Features

- **Core Operations**: `CreateLogisticsOrder`, `QueryLogisticsOrder`, `PrintTradeDocument`, `LogisticsNotify`
- **Mutations**: `UpdateTempTrade`, `CancelC2COrder`, `UpdateB2COrder`, `UpdateC2COrder`
- **Return Logistics**: `ReturnHome`, `ReturnCVS`
- **Cryptography**: AES-128-CBC encryption/decryption compatible with ECPay
- **Type Safety**: Full TypeScript support with comprehensive Enums (`LogisticsType`, `LogisticsSubType`, `Temperature`, `Distance`, etc.)
- **Dual Support**: ESM and CJS builds
- **Testing**: Over 95% test coverage

## Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
