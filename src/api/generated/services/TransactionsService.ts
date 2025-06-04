/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TransactionsService {
    /**
     * Get transaction history
     * Retrieves paginated transaction history for the authenticated user
     * @param page The page number for pagination, starting from 1
     * @param pageSize Number of transactions per page, maximum 100
     * @returns any Returns paginated transaction history with metadata
     * @throws ApiError
     */
    public static getTransactionHistory(
        page?: number,
        pageSize?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/transactions/history',
            query: {
                'page': page,
                'pageSize': pageSize,
            },
            errors: {
                400: `Invalid pagination parameters or request format`,
                401: `User not authenticated or invalid authentication header`,
                404: `No account found for the authenticated user`,
                500: `An error occurred while processing the request`,
            },
        });
    }
    /**
     * Request invoice email
     * Sends an invoice email for a specific transaction to the authenticated user
     * @param transactionId The unique identifier of the transaction for which to request an invoice
     * @returns any Returns confirmation that the invoice email has been queued for sending
     * @throws ApiError
     */
    public static requestInvoiceEmail(
        transactionId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/transactions/{transactionId}/request-invoice',
            path: {
                'transactionId': transactionId,
            },
            errors: {
                400: `Invalid transaction ID or request format`,
                401: `User not authenticated or invalid authentication header`,
                404: `No transaction found with the specified ID for the authenticated user`,
                500: `An error occurred while processing the request`,
            },
        });
    }
}
