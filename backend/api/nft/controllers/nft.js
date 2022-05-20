'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async findOne(ctx) {
       
        const { id } = ctx.params;
        // strapi.log.info(id);
        const entity = await strapi.services.nft.findOne({ id }, [
            'author', 'author.avatar', 'preview_image', 'bids.author', 'bids.author.avatar'
        ]);
        // console.log(entity+"endtity");
        const sanitized = sanitizeEntity(entity, { model: strapi.models.nft });
        // console.log(sanitized+"santized");

        const sortedBids = sanitized.bids.sort((a, b) => (a.id < b.id) ? 1 : -1);
        sanitized.bids = sortedBids;
        sanitized.history = sortedBids;
        console.log(sanitized+"santized");
        return sanitized;
    },

    async showcase(ctx) {
        const entity = await strapi.services.nft.find(ctx.query, [
            'author', 'preview_image'
        ]);
        console.log(1);
        const sanitized = sanitizeEntity(entity, { model: strapi.models.nft });
        const filtered = sanitized.filter(item => item.showcase);

        return filtered;
    }
};
