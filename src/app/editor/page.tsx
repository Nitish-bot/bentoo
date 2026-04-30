'use client';

import React from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import Container from '@/components/editor/craft/Container';
import Text from '@/components/editor/craft/Text';
import ImageNode from '@/components/editor/craft/Image';
import Button from '@/components/editor/craft/Button';
import { Viewport } from '@/components/editor/Viewport';
import { RenderNode } from '@/components/editor/RenderNode';

const components = { Container, Text, ImageNode, Button } as const;

export default function EditorPage() {
  return (
    <Editor resolver={components} onRender={RenderNode}>
      <Viewport>
        <Frame>
          <Element
            is={Container}
            paddingTop={24}
            paddingRight={24}
            paddingBottom={24}
            paddingLeft={24}
            backgroundColor="#ffffff"
            height="100%"
            canvas
          >
            <Text
              tag="h1"
              text="Your Site Title"
              fontSize={32}
              fontWeight="700"
            />
            <Text
              tag="p"
              text="Start building your page..."
              fontSize={16}
              color="#6b7280"
            />
            <Element
              is={Container}
              paddingTop={16}
              paddingRight={16}
              paddingBottom={16}
              paddingLeft={16}
              direction="row"
              gap={12}
              alignItems="center"
              canvas
            >
              <Button label="Read more" />
              <Button label="Learn more" variant="ghost" />
            </Element>
          </Element>
        </Frame>
      </Viewport>
    </Editor>
  );
}
