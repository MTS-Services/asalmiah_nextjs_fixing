const { RateLimiterMemory } = require("rate-limiter-flexible");

/**
 * Creates a rate limit checker middleware.
 *
 * @param {number} points - The maximum number of requests allowed within the duration.
 * @param {number} duration - The duration (in seconds) for which the rate limit applies.
 * @param {number} blockDuration - The duration (in seconds) for which an IP is blocked after exceeding the rate limit.
 * @returns {function} - The rate limit checker middleware.
 */

const blockedIps = {};

const rateLimitChecker = (points, duration, blockDuration) => {
  const rateLimiter = new RateLimiterMemory({
    points: points,
    duration: duration,
    blockDuration: blockDuration,
  });

  return (req, res, next) => {
    if (blockedIps[req.ip] && blockedIps[req.ip] > Date.now()) {
      return res.status(403).send({
        statusCode: 403,
        message: "Your IP is temporarily blocked due to too many requests. Please try again later.",
      });
    }
    rateLimiter.consume(req.ip).then(() => {
        next();
      })
      .catch(() => {
        blockedIps[req.ip] = Date.now() + blockDuration * 1000; 
        res.status(429).send({
          statusCode: 429,
          message: "Too Many Requests - Your IP is temporarily blocked.",
        });
      });
  };
};

module.exports.rateLimitChecker = rateLimitChecker;