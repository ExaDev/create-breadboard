#!/usr/bin/env node --harmony

import { makeProgram } from "./program/makeProgram";

makeProgram().parse(process.argv);


