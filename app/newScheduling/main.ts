import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from '@scheduling/scheduling.module';

platformBrowserDynamic().bootstrapModule(AppModule);
