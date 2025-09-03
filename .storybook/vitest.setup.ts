// import { setProjectAnnotations } from '@storybook/react-vite';
// import * as projectAnnotations from './preview';

// // This is an important step to apply the right configuration when testing your stories.
// // More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
// setProjectAnnotations([projectAnnotations]);

import { setProjectAnnotations } from '@storybook/react';
import * as previewAnnotations from './preview';

// Apply Storybook preview annotations to Vitest portable stories environment
setProjectAnnotations([previewAnnotations]);
