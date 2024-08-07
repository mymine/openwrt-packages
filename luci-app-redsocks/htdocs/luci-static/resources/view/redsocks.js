'use strict';
'require view';
'require rpc';
'require fs';
'require ui';

var isReadonlyView = !L.hasViewPermission() || null;

return view.extend({
	callInitList: rpc.declare({
		object: 'luci',
		method: 'getInitList',
		expect: { '': {} }
	}),

	callInitAction: rpc.declare({
		object: 'luci',
		method: 'setInitAction',
		params: [ 'name', 'action' ],
		expect: { result: false }
	}),

	load: function() {
		return Promise.all([
			L.resolveDefault(fs.read('/etc/redsocks.conf'), ''),
			
		]);
	},

	handleAction: function(name, action, ev) {
		return this.callInitAction(name, action).then(function(success) {
			if (success != true)
				throw _('Command failed');

			return true;
		}).catch(function(e) {
			ui.addNotification(null, E('p', _('Failed to execute "/etc/init.d/%s %s" action: %s').format(name, action, e)));
		});
	},

	handleEnableDisable: function(name, isEnabled, ev) {
		return this.handleAction(name, isEnabled ? 'disable' : 'enable', ev).then(L.bind(function(name, isEnabled, btn) {
			btn.parentNode.replaceChild(this.renderEnableDisable({
				name: name,
				enabled: isEnabled
			}), btn);
		}, this, name, !isEnabled, ev.currentTarget));
	},

	handleRcLocalSave: function(ev) {
		var value = (document.querySelector('textarea').value || '').trim().replace(/\r\n/g, '\n') + '\n';

		return fs.write('/etc/redsocks.conf', value).then(function() {
			document.querySelector('textarea').value = value;
			ui.addNotification(null, E('p', _('Contents have been saved.')), 'info');
		}).catch(function(e) {
			ui.addNotification(null, E('p', _('Unable to save contents: %s').format(e.message)));
		});
	},

	renderEnableDisable: function(init) {
		return E('button', {
			class: 'btn cbi-button-%s'.format(init.enabled ? 'positive' : 'negative'),
			click: ui.createHandlerFn(this, 'handleEnableDisable', init.name, init.enabled),
			disabled: isReadonlyView
		}, init.enabled ? _('Enabled') : _('Disabled'));
	},

	render: function(data) {
		var rcLocal = data[0],
		    initList = data[1],
		    rows = [], list = [];

		var table = E('table', { 'class': 'table' }, [
			E('tr', { 'class': 'tr table-titles' }, [
				E('th', { 'class': 'th' }, _('Start priority')),
				E('th', { 'class': 'th' }, _('Initscript')),
				E('th', { 'class': 'th nowrap cbi-section-actions' })
			])
		]);





		var view = E('div', {}, [
			E('h2', _('Redsocks')),
			E('div', {}, [
				E('div', { 'data-tab': 'rc', 'data-tab-title': _('Config file') }, [

					E('p', {}, _('This is the content of /etc/redsocks.conf.')),
					E('p', {}, E('textarea', { 'style': 'width:100%', 'rows': 20, 'disabled': isReadonlyView }, [ (rcLocal != null ? rcLocal : '') ])),
					E('div', { 'class': 'cbi-page-actions' }, [
						E('button', { 'class': 'btn cbi-button-action', 'click': ui.createHandlerFn(this, 'handleAction', 'redsocks', 'start'), 'disabled': isReadonlyView }, _('Start')),
						E('button', { 'class': 'btn cbi-button-action', 'click': ui.createHandlerFn(this, 'handleAction', 'redsocks', 'restart'), 'disabled': isReadonlyView }, _('Restart')),
						E('button', { 'class': 'btn cbi-button-action', 'click': ui.createHandlerFn(this, 'handleAction', 'redsocks', 'stop'), 'disabled': isReadonlyView }, _('Stop')),
						E('button', {
							'class': 'btn cbi-button-save',
							'click': ui.createHandlerFn(this, 'handleRcLocalSave'),
							'disabled': isReadonlyView
						}, _('Save'))
					])
				])
			])
		]);

		ui.tabs.initTabGroup(view.lastElementChild.childNodes);

		return view;
	},

	handleSaveApply: null,
	handleSave: null,
	handleReset: null
});
