/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { stripeCheckoutRequest } from "../models/stripeCheckoutRequest";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class SubscriptionService {
  /**
   * Get user subscription
   * Returns the subscription tier, accountId, and account holder status for the authenticated user
   * @returns any Returns subscription tier, account ID, and account holder status
   * @throws ApiError
   */
  public static getSubscription(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/subscription",
      errors: {
        401: `Missing or invalid authentication header`,
      },
    });
  }
  /**
   * List Stripe subscriptions
   * Returns all active Stripe products and their prices for account management.
   * @returns any Returns list of active Stripe products with pricing information
   * @throws ApiError
   */
  public static listStripeSubscriptions(): CancelablePromise<Array<any>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/subscriptions",
      errors: {
        500: `Stripe API key not configured`,
      },
    });
  }
  /**
   * Create Stripe checkout session
   * Creates a Stripe Checkout session for subscription payment. Cleans up stale sessions and returns the checkout URL.
   * @param body Checkout session creation request
   * @returns any Returns the Stripe checkout session URL
   * @throws ApiError
   */
  public static createCheckoutSession(
    body: stripeCheckoutRequest
  ): CancelablePromise<any> {
    debugger;
    if (!body.priceId || !body.accountId || !body.email) {
      throw new Error("Missing priceId, accountId, or invalid product");
    }
    return __request(OpenAPI, {
      method: "POST",
      url: "/checkout",
      body: body,
      errors: {
        400: `Missing priceId, accountId, or invalid product`,
        403: `Invalid account access - user must be an account holder`,
        500: `Stripe API key not configured or internal error`,
      },
    });
  }
}
