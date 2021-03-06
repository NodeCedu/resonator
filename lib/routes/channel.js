'use strict';
const ObjectId = require('mongoose').Types.ObjectId;

const channels = require('../platforms/channel');
const errors = require('../util/errors');
const checkChannel = require('../middleware/check_channel');

let routes = {};

routes.getChannel = function(req, res, next) {

  const identity = req.identity;

  channels.retrieveChannelDataForIdentity(identity, function(err, channelData) {

    if (err) {
      return next(err);
    }

    res.status(200).send(channelData);
  });
};

routes.createChannel = function(req, res, next) {

  channels.createChannel(req.body, function(err, createdChannel) {

    if (err) {
      return next(err);
    }

    res.status(201).send({id: createdChannel.id});
  });
};

routes.deleteChannel = function(req, res, next) {

  const channelId = req.params.channelId;

  if (!channelId) {
    return next(new errors.BadRequestError('Unknown provided channel identifier'));
  }

  if (!ObjectId.isValid(channelId)) {
    return next(new errors.BadRequestError('Invalid channel object identifier format'));
  }

  channels.deleteChannel(channelId, function(err) {

    if (err) {
      return next(err);
    }

    res.sendStatus(204);
  });
};

routes.updateChannel = function(req, res, next) {

  const channelId = req.params.channelId;

  if (!channelId) {
    return next(new errors.BadRequestError('Unknown provided channel identifier'));
  }

  if (!ObjectId.isValid(channelId)) {
    return next(new errors.BadRequestError('Invalid channel object identifier format'));
  }

  channels.updateChannel(channelId, req.body, function(err) {

    if (err) {
      return next(err);
    }

    res.sendStatus(204);
  });
};

routes.getChannelIdentities = function(req, res, next) {

  const channelId = req.params.channelId;

  if (!channelId) {
    return next(new errors.BadRequestError('Unknown provided channel identifier'));
  }

  if (!ObjectId.isValid(channelId)) {
    return next(new errors.BadRequestError('Invalid channel object identifier format'));
  }

  channels.retrieveIdentityListForChannel(channelId, function(err, identityList) {

    if (err) {
      return next(err);
    }

    res.status(200).send(identityList);
  });
};

routes.deleteIdentityFromChannel = function(req, res, next) {

  const channelId = req.params.channelId;
  const identityId = req.params.identityId;

  if (!channelId) {
    return next(new errors.BadRequestError('Unknown provided channel identifier'));
  }

  if (!ObjectId.isValid(channelId)) {
    return next(new errors.BadRequestError('Invalid channel object identifier format'));
  }

  if (!identityId) {
    return next(new errors.BadRequestError('Unknown provided identity identifier'));
  }

  channels.deleteIdentityFromChannel(channelId, identityId, function(err) {

    if (err) {
      return next(err);
    }

    res.sendStatus(204);
  });
};

module.exports = function(server) {

  server.get('/api/channel', routes.getChannel);
  server.post('/api/channel', checkChannel(), routes.createChannel);
  server.delete('/api/channel/:channelId', routes.deleteChannel);
  server.put('/api/channel/:channelId', checkChannel(), routes.updateChannel);
  server.get('/api/channel/:channelId/identities', routes.getChannelIdentities);
  server.delete('/api/channel/:channelId/identities/:identityId', routes.deleteIdentityFromChannel);
};
