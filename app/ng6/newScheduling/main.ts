import './polyfills';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from '@scheduling/scheduling.module';

platformBrowserDynamic().bootstrapModule(AppModule);
