import { ISection, SectionComponent, SectionComponentType } from './interfaces';

const AVAILABLE_COMPONENT_TYPES = Object.keys(SectionComponentType).map(
  name => SectionComponentType[name]
);

const componentValidators = {
  [SectionComponentType.Button]: ({ data }) => {
    if (!data || !data.label) {
      throw new Error(`The button component must have a 'label' property`);
    }
    if (!data.id) {
      throw new Error(`The button component must have a 'id' property`);
    }
  },

  [SectionComponentType.Link]: ({ data }) => {
    if (!data || !data.url) {
      throw new Error(`The link component must have a 'url' property`);
    }
  },

  [SectionComponentType.Title]: ({ data }) => {
    if (!data || !data.title) {
      throw new Error(`The title component must have a 'title' property`);
    }
    if (typeof data.imgSize !== 'undefined') {
      if (!['big', 'small'].includes(data.imgSize)) {
        throw new Error(
          `The title component must have a valid 'imgSize' property, allowed values are 'small' and 'big'`
        );
      }
    }
  }
};

function assertComponent(component: SectionComponent) {
  if (typeof component !== 'object') {
    throw new Error(`The component definition must be an object`);
  }

  const { type } = component;
  if (typeof type !== 'string' || !AVAILABLE_COMPONENT_TYPES.includes(type)) {
    throw new Error(`Invalid component type given: '${type}'`);
  }

  const validator = componentValidators[type];
  if (validator) {
    validator(component);
  }
}

export default function assertSection(section: ISection) {
  if (!section) {
    throw new Error('You need to provide a section defintion');
  }

  const { title, components } = section;

  if (typeof title !== 'string' || !title) {
    throw new Error(
      `You need to provide a title for the new section using the 'title' property`
    );
  }

  if (!Array.isArray(components) || !components.length) {
    throw new Error(
      `You need to provide an array of component definitions for your section using the 'components' property`
    );
  }

  components.forEach(assertComponent);
}
