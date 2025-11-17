// Custom Notification System
class NotificationSystem {
	constructor() {
		this.container = null;
		this.init();
	}

	init() {
		// Create notification container if not exists
		if (!document.getElementById('notification-container')) {
			this.container = document.createElement('div');
			this.container.id = 'notification-container';
			this.container.className = 'notification-container';
			document.body.appendChild(this.container);
		} else {
			this.container = document.getElementById('notification-container');
		}

		// Create modal container for dialogs
		if (!document.getElementById('custom-modal-overlay')) {
			const overlay = document.createElement('div');
			overlay.id = 'custom-modal-overlay';
			overlay.className = 'custom-modal-overlay';
			document.body.appendChild(overlay);
		}
	}

	// Toast notification
	toast(message, type = 'info', duration = 3000) {
		const toast = document.createElement('div');
		toast.className = `notification-toast notification-${type}`;

		const icon = this.getIcon(type);

		toast.innerHTML = `
			<div class="notification-icon">${icon}</div>
			<div class="notification-content">
				<p class="notification-message">${message}</p>
			</div>
			<button class="notification-close" onclick="this.parentElement.remove()">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		`;

		this.container.appendChild(toast);

		// Auto remove after duration
		setTimeout(() => {
			toast.style.animation = 'slideOut 0.3s ease-out';
			setTimeout(() => toast.remove(), 300);
		}, duration);

		return toast;
	}

	// Success notification
	success(message, duration = 3000) {
		return this.toast(message, 'success', duration);
	}

	// Error notification
	error(message, duration = 4000) {
		return this.toast(message, 'error', duration);
	}

	// Warning notification
	warning(message, duration = 3500) {
		return this.toast(message, 'warning', duration);
	}

	// Info notification
	info(message, duration = 3000) {
		return this.toast(message, 'info', duration);
	}

	// Alert dialog (replaces window.alert)
	alert(message, title = 'Thông báo') {
		return new Promise((resolve) => {
			const modal = this.createModal({
				title,
				message,
				buttons: [
					{
						text: 'OK',
						type: 'primary',
						onClick: () => {
							this.closeModal(modal);
							resolve(true);
						},
					},
				],
			});
		});
	}

	// Confirm dialog (replaces window.confirm)
	confirm(message, title = 'Xác nhận', options = {}) {
		return new Promise((resolve) => {
			const modal = this.createModal({
				title,
				message,
				type: options.type || 'warning',
				buttons: [
					{
						text: options.cancelText || 'Hủy',
						type: 'secondary',
						onClick: () => {
							this.closeModal(modal);
							resolve(false);
						},
					},
					{
						text: options.confirmText || 'Xác nhận',
						type: options.confirmType || 'primary',
						onClick: () => {
							this.closeModal(modal);
							resolve(true);
						},
					},
				],
			});
		});
	}

	// Prompt dialog (replaces window.prompt)
	prompt(message, title = 'Nhập thông tin', defaultValue = '', options = {}) {
		return new Promise((resolve) => {
			const inputId = 'prompt-input-' + Date.now();
			const modal = this.createModal({
				title,
				message,
				content: `
					<input 
						type="${options.type || 'text'}" 
						id="${inputId}" 
						class="custom-prompt-input" 
						placeholder="${options.placeholder || ''}"
						value="${defaultValue}"
					/>
				`,
				buttons: [
					{
						text: 'Hủy',
						type: 'secondary',
						onClick: () => {
							this.closeModal(modal);
							resolve(null);
						},
					},
					{
						text: 'OK',
						type: 'primary',
						onClick: () => {
							const input = document.getElementById(inputId);
							const value = input ? input.value.trim() : '';
							this.closeModal(modal);
							resolve(value || null);
						},
					},
				],
			});

			// Focus input after modal opens
			setTimeout(() => {
				const input = document.getElementById(inputId);
				if (input) {
					input.focus();
					input.select();
					// Submit on Enter key
					input.addEventListener('keypress', (e) => {
						if (e.key === 'Enter') {
							const value = input.value.trim();
							this.closeModal(modal);
							resolve(value || null);
						}
					});
				}
			}, 100);
		});
	}

	// Create modal dialog
	createModal(config) {
		const overlay = document.getElementById('custom-modal-overlay');

		const modal = document.createElement('div');
		modal.className = 'custom-modal';

		const icon = config.type ? this.getIcon(config.type) : '';

		modal.innerHTML = `
			<div class="custom-modal-header">
				${
					icon
						? `<div class="custom-modal-icon custom-modal-icon-${config.type}">${icon}</div>`
						: ''
				}
				<h3 class="custom-modal-title">${config.title}</h3>
			</div>
			<div class="custom-modal-body">
				<p class="custom-modal-message">${config.message}</p>
				${config.content || ''}
			</div>
			<div class="custom-modal-footer">
				${config.buttons
					.map(
						(btn) => `
					<button class="custom-modal-btn custom-modal-btn-${btn.type}" data-action="${btn.text}">
						${btn.text}
					</button>
				`
					)
					.join('')}
			</div>
		`;

		overlay.appendChild(modal);
		overlay.classList.add('active');
		document.body.style.overflow = 'hidden';

		// Add button event listeners
		config.buttons.forEach((btn, index) => {
			const btnElement = modal.querySelectorAll('.custom-modal-btn')[index];
			if (btnElement) {
				btnElement.addEventListener('click', btn.onClick);
			}
		});

		// Close on overlay click
		overlay.addEventListener('click', (e) => {
			if (e.target === overlay) {
				const cancelBtn = config.buttons.find(
					(btn) => btn.type === 'secondary'
				);
				if (cancelBtn) cancelBtn.onClick();
			}
		});

		// Close on Escape key
		const escapeHandler = (e) => {
			if (e.key === 'Escape') {
				const cancelBtn = config.buttons.find(
					(btn) => btn.type === 'secondary'
				);
				if (cancelBtn) cancelBtn.onClick();
				document.removeEventListener('keydown', escapeHandler);
			}
		};
		document.addEventListener('keydown', escapeHandler);

		return modal;
	}

	// Close modal
	closeModal(modal) {
		const overlay = document.getElementById('custom-modal-overlay');
		modal.style.animation = 'modalFadeOut 0.2s ease-out';
		overlay.style.animation = 'fadeOut 0.2s ease-out';

		setTimeout(() => {
			modal.remove();
			overlay.classList.remove('active');
			overlay.style.animation = '';
			document.body.style.overflow = '';
		}, 200);
	}

	// Get icon for notification type
	getIcon(type) {
		const icons = {
			success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
				<polyline points="22 4 12 14.01 9 11.01"></polyline>
			</svg>`,
			error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="15" y1="9" x2="9" y2="15"></line>
				<line x1="9" y1="9" x2="15" y2="15"></line>
			</svg>`,
			warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
				<line x1="12" y1="9" x2="12" y2="13"></line>
				<line x1="12" y1="17" x2="12.01" y2="17"></line>
			</svg>`,
			info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="16" x2="12" y2="12"></line>
				<line x1="12" y1="8" x2="12.01" y2="8"></line>
			</svg>`,
		};
		return icons[type] || icons.info;
	}
}

// Create global instance
window.notify = new NotificationSystem();

// Override default browser dialogs (optional)
window.customAlert = window.notify.alert.bind(window.notify);
window.customConfirm = window.notify.confirm.bind(window.notify);
window.customPrompt = window.notify.prompt.bind(window.notify);
