import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { widgetsDb } from "./db";
import EventHandler from "./eventhandler";

let SETTINGS_CACHE: { [key: string]: { [key: string]: any } } = {};

export const useCachedSetting = (id: string, key: string): [any, Function] => {
	const [state, setState] = useState(
		SETTINGS_CACHE[id] !== undefined &&
			SETTINGS_CACHE[id][key] !== undefined
			? SETTINGS_CACHE[id][key]
			: null
	);

	const changeData = (newValue: any, update_database?: boolean) => {
		setState(newValue);

		if (SETTINGS_CACHE[id] === undefined) {
			SETTINGS_CACHE[id] = {};
		}

		SETTINGS_CACHE[id][key] = newValue;
		SETTINGS_CACHE = { ...SETTINGS_CACHE };

		if (update_database) {
			widgetsDb.setSetting(id, key, newValue);
		}
	};

	useEffect(() => {
		if (SETTINGS_CACHE[id] !== undefined) {
			if (SETTINGS_CACHE[id][key] !== undefined) {
				setState(SETTINGS_CACHE[id][key]);
				return;
			} else {
				widgetsDb.getSetting(id, key).then((value) => {
					if (value) {
						changeData(value, false);
					}
				});
			}
		} else {
			widgetsDb.getSetting(id, key).then((value) => {
				if (value) {
					changeData(value, false);
				}
			});
		}
	}, [id, key, SETTINGS_CACHE[id]]);

	return [state, changeData];
};

export const useSetting = (id: string, key: string): [any, Function] => {
	const [state, setState] = useState();
	const data = useLiveQuery(() =>
		widgetsDb.widgets.where("id").equals(id).toArray()
	);

	const changeData = (newValue: any) => {
		setState(newValue);
		widgetsDb.setSetting(id, key, newValue);
	};

	useEffect(() => {
		if (data !== undefined) {
			if (data[0] !== undefined) {
				setState(data[0].settings[key]);
			}
		}
	}, [data, key]);

	return [state, changeData];
};

const EmptyElement = new Proxy(
	{},
	{
		get: (obj, prop) => undefined,
	}
);

export const useWidget = (id: string): any => {
	const [state, setState] = useState<{ [key: string]: string }>(EmptyElement);

	const data = useLiveQuery(() =>
		widgetsDb.widgets.where("id").equals(id).toArray()
	);

	useEffect(() => {
		if (data !== undefined) {
			if (data[0] !== undefined) {
				setState(data[0].settings);
			}
		}
	}, [data]);

	return state;
};

export const useEvent = (
	event_name: string,
	identifier: string,
	default_value?: any,
	trigger_function?: Function
): [any, Function] => {
	const [state, setState] = useState(default_value);
	const changeEvent = (value: any) =>
		EventHandler.emit(event_name, { value: value, sender: identifier });

	useEffect(() => {
		EventHandler.on(event_name, identifier, (data: any) => {
			const value = (trigger_function || (() => {}))(data) || data.value;
			setState(value);
		});

		return () => {
			EventHandler.off(event_name, identifier);
		};
	}, [event_name, identifier, trigger_function]);

	return [state, changeEvent];
};
