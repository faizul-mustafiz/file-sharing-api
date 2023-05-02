const { redisClient } = require('../plugins/redis.plugin');
const { jsonToArray } = require('../helpers/conversion.helper');
const logger = require('../loggers/logger');

/**
 * * generic reusable methods for redis store
 */
const isIdentityExists = async (identity) => {
  try {
    let result = await redisClient.exists(identity);
    logger.debug('isIdentityExists-result: %s', result);
    return result;
  } catch (error) {
    logger.error('isIdentityExists-error:', error);
  }
};
const setIdentityWithHSet = async (identity, expiry, payload) => {
  try {
    const payloadArray = jsonToArray(payload);
    let result = await redisClient.hSet(identity, payloadArray);
    result = await redisClient.expireAt(identity, expiry);
    logger.debug('setIdentityWithHSet-result: %s', result);
    return result;
  } catch (error) {
    logger.error('setIdentityWithHSet-error:', error);
  }
};
const setIdentityWithHSetNoExpiry = async (identity, payload) => {
  try {
    const payloadArray = jsonToArray(payload);
    const result = await redisClient.hSet(identity, payloadArray);
    logger.debug('setIdentityWithHSetNoExpiry-result: %s', result);
    return result;
  } catch (error) {
    logger.error('setIdentityWithHSetNoExpiry-error:', error);
  }
};
const setIdentity = async (identity, expiry, payload) => {
  try {
    let result = await redisClient.set(identity, payload);
    result = await redisClient.expireAt(identity, expiry);
    logger.debug('setIdentity-result: %s', result);
    return result;
  } catch (error) {
    logger.error('setIdentity-error:', error);
  }
};
const setIdentityWithNoExpiry = async (identity, payload) => {
  try {
    let result = await redisClient.set(identity, payload);
    logger.debug('setIdentityWithNoExpiry-result: %s', result);
    return result;
  } catch (error) {
    logger.error('setIdentityWithNoExpiry-error:', error);
  }
};
const getHSetIdentityPayload = async (identity) => {
  try {
    let result = await redisClient.hGetAll(identity);
    logger.debug('getHSetIdentityPayload-result: %s', result);
    return result;
  } catch (error) {
    logger.error('getHSetIdentityPayload-error:', error);
  }
};
const getIdentityPayload = async (identity) => {
  try {
    let result = await redisClient.get(identity);
    logger.debug('getIdentityPayload-result: %s', result);
    return result;
  } catch (error) {
    logger.error('getIdentityPayload-error:', error);
  }
};
const deleteIdentity = async (identity) => {
  try {
    let result = await redisClient.del(identity);
    logger.debug('deleteTokenPayload-result: %s', result);
    return result;
  } catch (error) {
    logger.error('deleteTokenPayload-error:', error);
  }
};

/**
 * * file related redis store methods
 */
const isPublicKeyIdentityExists = async (identity) => {
  try {
    const result = await isIdentityExists(`f:${identity}`);
    logger.debug('isPublicKeyIdentityExists-result: %s', result);
    return result;
  } catch (error) {
    logger.error('isPublicKeyIdentityExists-error:', error);
  }
};
const setPublicKeyIdentity = async (identity, payload) => {
  try {
    const result = await setIdentityWithHSetNoExpiry(`f:${identity}`, payload);
    logger.debug('setPublicKeyIdentity-result: %s', result);
    return result;
  } catch (error) {
    logger.error('setPublicKeyIdentity-error:', error);
  }
};
const getPublicKeyIdentity = async (identity) => {
  try {
    let result = await getHSetIdentityPayload(`f:${identity}`);
    logger.debug('getPublicKeyIdentity-result: %s', result);
    return result;
  } catch (error) {
    logger.error('getPublicKeyIdentity-error:', error);
  }
};
const deletePublicKeyIdentity = async (identity) => {
  try {
    const result = await deleteIdentity(`f:${identity}`);
    logger.debug('deletePublicKeyIdentity-result: %s', result);
    return result;
  } catch (error) {
    logger.error('deletePublicKeyIdentity-error:', error);
  }
};

const isPrivateKeyIdentityExists = async (identity) => {
  try {
    const result = await isIdentityExists(`p:${identity}`);
    logger.debug('isPrivateKeyIdentityExists-result: %s', result);
    return result;
  } catch (error) {
    logger.error('isPrivateKeyIdentityExists-error:', error);
  }
};
const setPrivateKeyIdentity = async (identity, payload) => {
  try {
    const result = await setIdentityWithNoExpiry(`p:${identity}`, payload);
    logger.debug('setPrivateKeyIdentity-result: %s', result);
    return result;
  } catch (error) {
    logger.error('setPrivateKeyIdentity-error:', error);
  }
};
const getPrivateKeyIdentity = async (identity) => {
  try {
    let result = await getIdentityPayload(`p:${identity}`);
    logger.debug('getPrivateKeyIdentity-result: %s', result);
    return result;
  } catch (error) {
    logger.error('getPrivateKeyIdentity-error:', error);
  }
};
const deletePrivateKeyIdentity = async (identity) => {
  try {
    const result = await deleteIdentity(`p:${identity}`);
    logger.debug('deletePrivateKeyIdentity-result: %s', result);
    return result;
  } catch (error) {
    logger.error('deletePrivateKeyIdentity-error:', error);
  }
};

/**
 * * rate limiter related redis store method
 */

const isRateLimitRecordExists = async (identity) => {
  try {
    const result = await isIdentityExists(`rt:${identity}`);
    logger.debug('isRateLimitRecordExists-result: %s', result);
    return result;
  } catch (error) {
    logger.error('isRateLimitRecordExists-error:', error);
  }
};
const setRateLimitRecord = async (identity, expiry, payload) => {
  try {
    const parsedPayload = JSON.stringify(payload);
    const result = await setIdentity(`rt:${identity}`, expiry, parsedPayload);
    logger.debug('setRateLimitRecord-result: %s', result);
    return result;
  } catch (error) {
    logger.error('setRateLimitRecord-error:', error);
  }
};
const getRateLimitRecord = async (identity) => {
  try {
    let result = await getIdentityPayload(`rt:${identity}`);
    logger.debug('getRateLimitRecord-result: %s', result);
    return JSON.parse(result);
  } catch (error) {
    logger.error('getRateLimitRecord-error:', error);
  }
};
const deleteRateLimitRecord = async (identity) => {
  try {
    let result = await deleteIdentity(`rt:${identity}`);
    logger.debug('deleteRateLimitRecord-result: %s', result);
    return result;
  } catch (error) {
    logger.error('deleteRateLimitRecord-error:', error);
  }
};

/**
 * * clean up redis test db after test complete
 */
const deleteTestDataFromRedis = async () => {
  try {
    const result = await redisClient.flushDb('ASYNC');
    logger.debug('deleteTestDataFromRedis-result: %s', result);
  } catch (error) {
    logger.error('deleteTestDataFromRedis-error', error);
  }
};

module.exports = {
  isPublicKeyIdentityExists,
  setPublicKeyIdentity,
  getPublicKeyIdentity,
  deletePublicKeyIdentity,
  isPrivateKeyIdentityExists,
  setPrivateKeyIdentity,
  getPrivateKeyIdentity,
  deletePrivateKeyIdentity,
  isRateLimitRecordExists,
  setRateLimitRecord,
  getRateLimitRecord,
  deleteRateLimitRecord,
  deleteTestDataFromRedis,
};
