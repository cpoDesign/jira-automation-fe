/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { inviteUserRequest } from '../models/inviteUserRequest';
import type { inviteUserResponse } from '../models/inviteUserResponse';
import type { listAccountUsersResponse } from '../models/listAccountUsersResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountService {
    /**
     * Close user account
     * Closes the account for the authenticated user. If user is account holder, cancels subscription and closes entire account. If invited user, removes them from the account.
     * @returns any Account closure completed - message indicates whether account was closed or user was removed
     * @throws ApiError
     */
    public static closeAccount(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/close',
            errors: {
                401: `Missing or invalid identity`,
                404: `Account not found`,
            },
        });
    }
    /**
     * Invite user to account
     * Invites a new user to the account. Only account holders can invite users.
     * @param body User invitation request containing the email to invite
     * @returns inviteUserResponse User has been successfully invited to the account
     * @throws ApiError
     */
    public static inviteUser(
        body: inviteUserRequest,
    ): CancelablePromise<inviteUserResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invite-user',
            body: body,
            errors: {
                400: `Invalid request body or missing required fields`,
                401: `Missing or invalid authentication header`,
                409: `User with this email already exists in the account`,
                500: `An error occurred while inviting the user`,
            },
        });
    }
    /**
     * List account users
     * Returns all users in the account if caller is account holder, or only caller's info if invited user
     * @returns listAccountUsersResponse Returns account info and list of users
     * @throws ApiError
     */
    public static listAccountUsers(): CancelablePromise<listAccountUsersResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/account/users',
            errors: {
                401: `Missing or invalid authentication header`,
                404: `User account not found in the system`,
                500: `An error occurred while retrieving account users`,
            },
        });
    }
}
