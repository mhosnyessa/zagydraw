import { render, screen } from "@testing-library/react";
import App from "components/App";
import { act } from "@testing-library/react";
import { useStore } from "store";
import { clickCursor, createElement, pointerDown, pointerMove, pointerUp } from "tests/testUtils";
import { CursorFn } from "types/general";
import { Point } from "utils";

const initialStoreState = useStore.getState();
describe("multi selection", () => {
    beforeEach(() => {
        useStore.setState(initialStoreState, true);
    });
    it("should create a selection rect that is visible to the user", async () => {
        render(<App />);
        const canvas = await screen.findByTestId("canvas");
        if (!canvas) throw new Error("canvas not found");
        await clickCursor(CursorFn.Default);
        const pointerDownPos: Point = [300, 300];
        pointerDown(canvas, pointerDownPos);
        const movement = [100, 100];
        const endPos: Point = [pointerDownPos[0] + movement[0], pointerDownPos[1] + movement[1]];
        pointerMove(canvas, endPos);
        expect(useStore.getState().multiSelectRect?.x).toEqual(pointerDownPos[0]);
        expect(useStore.getState().multiSelectRect?.y).toEqual(pointerDownPos[1]);
        expect(useStore.getState().multiSelectRect?.endX).toEqual(endPos[0]);
        expect(useStore.getState().multiSelectRect?.endY).toEqual(endPos[1]);
    });
    it("should disappear when on pointerup", async () => {
        render(<App />);
        const canvas = await screen.findByTestId("canvas");
        if (!canvas) throw new Error("canvas not found");
        await clickCursor(CursorFn.Default);
        const pointerDownPos: Point = [300, 300];
        pointerDown(canvas, pointerDownPos);
        const movement: Point = [100, 100];
        const endPos: Point = [pointerDownPos[0] + movement[0], pointerDownPos[1] + movement[1]];
        pointerMove(canvas, endPos);
        pointerUp(canvas, endPos);
        expect(useStore.getState().multiSelectRect).toBeNull();
    });

    it("should select elements within this rect", async () => {
        render(<App />);
        const canvas = await screen.findByTestId<HTMLCanvasElement>("canvas");
        if (!canvas) throw new Error("canvas not found");
        // set screen size
        //todo maybe add this to some kind of test utils
        act(() => useStore.setState({ width: 1000, height: 1000 }));
        const pointerDownPos: Point = [300, 300];
        const movement: Point = [200, 200];
        const endPos: Point = [pointerDownPos[0] + movement[0], pointerDownPos[1] + movement[1]];
        //create selectable rect element
        await createElement(
            "rectangle",
            canvas,
            [pointerDownPos[0] + 50, pointerDownPos[1] + 50],
            [endPos[0] - 50, endPos[1] - 50]
        );
        // create unselectable rect element
        await createElement(
            "rectangle",
            canvas,
            [pointerDownPos[0] + 50, pointerDownPos[1] + 50],
            [pointerDownPos[0] - 150, pointerDownPos[1] - 150]
        );
        //create handdrawn element
        await createElement(
            "handdrawn",
            canvas,
            [pointerDownPos[0] + 50, pointerDownPos[1] + 50],
            [endPos[0] - 50, endPos[1] - 50]
        );
        //create line
        await createElement(
            "line",
            canvas,
            [pointerDownPos[0] + 50, pointerDownPos[1] + 50],
            [endPos[0] - 50, endPos[1] - 50]
        );
        //todo add text element when its bounding rect is fixed
        await clickCursor(CursorFn.Default);
        pointerDown(canvas, pointerDownPos);
        pointerMove(canvas, endPos);
        pointerUp(canvas, endPos);
        expect(useStore.getState().selectedElements.length).toBe(3);
    });
});
