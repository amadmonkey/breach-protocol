import { _AXES } from "./global";

class Axis {
	constructor({ active = _AXES.X, inactive = _AXES.Y }) {
		this.active = active;
		this.inactive = inactive;
	}
	toggle = () => ([this.active, this.inactive] = [this.inactive, this.active]);
}

export default Axis;
