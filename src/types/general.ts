import { Drawable } from "roughjs/bin/core";
type Point = [number, number];
type ElementTypes = "rectangle" | "line" | "text" | "handdrawn";

const FontTypeOptions = {
    code: 0,
    hand: 1,
    minecraft: 2,
} as const;
type FontTypeOptions = (typeof FontTypeOptions)[keyof typeof FontTypeOptions];
type FillStyleOptions = "solid" | "zigzag" | "dots" | "hachure";

interface SharedOptions {
    opacity: number;
    stroke: string;
    strokeLineDash: StrokeLineDash;
    strokeWidth: StrokeWidth;
}

type StrokeLineDash = number[];
type StrokeWidth = 1 | 3 | 6;
type FontSize = 16 | 24 | 32 | 48;

interface RectOptions extends SharedOptions {
    fill: string;
    fillStyle: FillStyleOptions;
}

interface LineOptions extends SharedOptions {
    fill: string;
    fillStyle: FillStyleOptions;
}

interface TextOptions extends SharedOptions {
    font: FontTypeOptions;
    fontSize: FontSize;
}

type GlobalConfigOptions = TextOptions &
    RectOptions &
    LineOptions & {
        cursorFn: CursorFn;
    };

interface Position {
    x: number;
    y: number;
}
interface CachableElement {
    cache: HTMLCanvasElement;
    cacheCtx: CanvasRenderingContext2D;
}

interface ZagyCanvasElement extends Partial<CachableElement> {
    id: string;
    shape: ElementTypes;
    x: number;
    y: number;
    endX: number;
    endY: number;
    willDelete?: boolean;
    opacity: number;
}

type CanvasRoughElement = ZagyCanvasElement & Drawable & { seed: number };
interface ZagyCanvasRectElement extends CanvasRoughElement, Partial<CachableElement> {
    shape: "rectangle";
}

interface ZagyCanvasLineElement extends CanvasRoughElement, Partial<CachableElement> {
    shape: "line";
    point1: Point;
    point2: Point;
}

interface ZagyCanvasTextElement extends ZagyCanvasElement {
    shape: "text";
    text: string[];
    options: TextOptions;
}

interface ZagyCanvasHandDrawnElement extends ZagyCanvasElement, Partial<CachableElement> {
    shape: "handdrawn";
    path2D: Path2D;
    paths: Point[];
    options: SharedOptions;
}

enum CursorFn {
    Default,
    Drag,
    Rect,
    Line,
    FreeDraw,
    Text,
    Erase,
    Move,
}

function isRect(el: ZagyCanvasElement): el is ZagyCanvasRectElement {
    return el.shape === "rectangle";
}

function isLine(el: ZagyCanvasElement): el is ZagyCanvasLineElement {
    return el.shape === "line";
}

function isText(el: ZagyCanvasElement): el is ZagyCanvasTextElement {
    return el.shape === "text";
}

function isHanddrawn(el: ZagyCanvasElement): el is ZagyCanvasHandDrawnElement {
    return el.shape === "handdrawn";
}

export type {
    ZagyCanvasElement,
    ZagyCanvasLineElement,
    CanvasRoughElement,
    ZagyCanvasRectElement,
    ZagyCanvasTextElement,
    GlobalConfigOptions,
    ZagyCanvasHandDrawnElement,
    ElementTypes,
    Position,
    LineOptions,
    RectOptions,
    TextOptions,
    StrokeLineDash,
    StrokeWidth,
    FontSize,
    FillStyleOptions,
    CachableElement,
};
export { CursorFn, FontTypeOptions, isLine, isRect, isText, isHanddrawn };
