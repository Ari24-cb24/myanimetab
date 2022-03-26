import React from 'react';
import './widgetsettingscomponent.css';
import SETTINGS_DESCRIPTOR from '../../../utils/settingsdescriptor';
import SettingsElement from './SettingsElement';


class WidgetSettingsComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                {
                    SETTINGS_DESCRIPTOR.SETTINGS_DESCRIPTOR.map(descriptor => 
                        <SettingsElement descriptor={ descriptor } descriptorId = { descriptor.id } key={ descriptor.id } />
                    )
                }
                <footer id="widget_settings__footer">
                    <div class="widget_settings__footer_urls">
                        <a href="https://github.com/aridevelopment-de/myanimetab">
                            <img src="/icons/github.svg" alt="GitHub" />
                        </a>
                        <a href="https://aridevelopment.de/">
                            <img src="/icons/website.png" alt="Website" />
                        </a>
                        <a href="https://twitter.com/AriOnIce">
                            <img src="/icons/twitter.svg" alt="Twitter" />
                        </a>
                        <a href="https://aridevelopment.de/discord">
                            <img src="/icons/discord.svg" alt="Discord" />
                        </a>
                        <a href="mailto:ari.publicmail@gmail.com">
                            <img src="/icons/email.svg" alt="Mail" />
                        </a>
                    </div>
                    <p id="copyright_infrigement">Copyright © 2022 aridevelopment.de</p>
                </footer>
            </React.Fragment>
        )
    }
}

export default WidgetSettingsComponent;