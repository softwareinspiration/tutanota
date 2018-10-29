//@flow

import {noOp} from "../api/common/utils/Utils"
import {isApp} from "../api/Env"
import {NotificationIcon} from "./base/icons/Icons"

function _showNotification(title: string, options: ?NotificationOptions): ?Notification {
	if (Notification.permission === "granted") {
		try {
			const actualOptions: NotificationOptions = Object.assign({}, {
				icon: NotificationIcon
			}, options)
			return new Notification(title, actualOptions)
		} catch (e) {
			// new Notification() throws an error in new chrome browsers on android devices.
			// According to the error message ServiceWorkerRegistration.showNotification() should be used instead.
			// This is currently not available on our test devices, so ignore notification errors.
			// Setails: http://stackoverflow.com/questions/29774836/failed-to-construct-notification-illegal-constructor
			console.warn("notification error", e);
		}
	}
	return null
}

export class Notifications {

	showNotification: (title: string, options?: NotificationOptions) => ?Notification

	constructor() {
		this.showNotification = (isApp() || typeof Notification === "undefined") ? noOp : _showNotification
	}

	/**
	 * Requests user permission if notifications are supported
	 * @returns {Promise<boolean>} resolves to "true" if we can send notifications.
	 */
	requestPermission(): void {
		if (isApp() || typeof Notification === "undefined") {
			return
		}
		try {
			if (Notification.permission !== "denied") {
				Notification.requestPermission()
			}
		} catch (e) {
			console.log("request notification permission error", e)
		}
	}
}

export const notifications = new Notifications()