import mongoose from 'mongoose';
import {
  MatchBranches,
  MatchCategories,
  MatchCities,
  MatchCountries,
  MatchMerchants,
  MatchOrders,
  MatchProductCategories,
  MatchProducts,
  MatchRest,
  MatchTables,
  MatchTags,
  MatchTransactions,
} from '../constants/filters.constants';
import buildDateQuery from './build-date-query';
import buildSearchQuery from './build-search-query';
import handleMatch from './handle-match';

export default function (query): object {
  const match = {};

  if (query.search) {
    match['$or'] = buildSearchQuery(query.search);
    return match;
  }

  if (query.categories || query.categoriesIds) {
    match['categories'] = handleMatch(MatchCategories, query);
  }

  if (query.productcategories || query.productcategoriesIds) {
    match['productcategories'] = handleMatch(MatchProductCategories, query);
  }

  if (query.cities || query.citiesIds) {
    match['cities'] = handleMatch(MatchCities, query);
  }

  if (query.countries || query.countriesIds) {
    match['countries'] = handleMatch(MatchCountries, query);
  }

  if (query.branches || query.branchesIds) {
    match['branches'] = handleMatch(MatchBranches, query);
  }

  if (query.tags || query.tagsIds) {
    match['tags'] = handleMatch(MatchTags, query);
  }

  if (query.merchants || query.merchantsIds) {
    match['merchants'] = handleMatch(MatchMerchants, query);
  }

  if (query.orders || query.orders) {
    match['orders'] = handleMatch(MatchOrders, query);
  }

  if (query.transactions || query.transactions) {
    match['transactions'] = handleMatch(MatchTransactions, query);
  }

  if (query.tables || query.tablesIds) {
    match['tables'] = handleMatch(MatchTables, query);
  }

  if (query.products || query.productsIds) {
    match['products'] = handleMatch(MatchProducts, query);
  }

  if (query.fromCreatedAt && query.toCreatedAt) {
    match['createdAt'] = buildDateQuery(query.fromCreatedAt, query.toCreatedAt);
  }

  if (query.valid_from) {
    match['valid_from'] = buildDateQuery(query.valid_from, query.valid_from);
  }

  if (query.expired_at) {
    match['expired_at'] = buildDateQuery(query.expired_at, query.expired_at);
  }

  if (query.dateTime) {
    match['dateTime'] = buildDateQuery(query.dateTime, query.dateTime);
  }

  if (query.models) {
    match['modelName'] = { $in: query.models };
  }

  if (query.target) {
    match['target._id'] = { $eq: new mongoose.Types.ObjectId(query.target) };
  }

  if (query.levels) {
    match['rating.level'] = {
      $in: query.levels.map((ele) => {
        return parseInt(ele);
      }),
    };
  }

  const rest = handleMatch(MatchRest, query);

  Object.assign(match, rest);

  return match;
}
