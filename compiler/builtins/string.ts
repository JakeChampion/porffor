// @porf --valtype=i32
import type {} from './porffor.d.ts';

// Special uppercase table lookup
// Grouped by high byte for efficiency
export const __Porffor_uppercase_table = (chr: i32): i32 => {
  const hi: i32 = chr >> 8;
  if (hi == 0x0) {
    if (chr == 0xB5) return 0x39C;
    if (chr == 0xFF) return 0x178;
  }
  if (hi == 0x1) {
    if (chr == 0x131) return 0x49;
    if (chr == 0x17F) return 0x53;
    if (chr == 0x180) return 0x243;
    if (chr == 0x195) return 0x1F6;
    if (chr == 0x19A) return 0x23D;
    if (chr == 0x19B) return 0xA7DC;
    if (chr == 0x19E) return 0x220;
    if (chr == 0x1BF) return 0x1F7;
    if (chr == 0x1C6) return 0x1C4;
    if (chr == 0x1C9) return 0x1C7;
    if (chr == 0x1CC) return 0x1CA;
    if (chr == 0x1DD) return 0x18E;
    if (chr == 0x1F3) return 0x1F1;
  }
  if (hi == 0x2) {
    if (chr == 0x23F) return 0x2C7E;
    if (chr == 0x240) return 0x2C7F;
    if (chr == 0x250) return 0x2C6F;
    if (chr == 0x251) return 0x2C6D;
    if (chr == 0x252) return 0x2C70;
    if (chr == 0x253) return 0x181;
    if (chr == 0x254) return 0x186;
    if (chr == 0x256) return 0x189;
    if (chr == 0x257) return 0x18A;
    if (chr == 0x259) return 0x18F;
    if (chr == 0x25B) return 0x190;
    if (chr == 0x25C) return 0xA7AB;
    if (chr == 0x260) return 0x193;
    if (chr == 0x261) return 0xA7AC;
    if (chr == 0x263) return 0x194;
    if (chr == 0x264) return 0xA7CB;
    if (chr == 0x265) return 0xA78D;
    if (chr == 0x266) return 0xA7AA;
    if (chr == 0x268) return 0x197;
    if (chr == 0x269) return 0x196;
    if (chr == 0x26A) return 0xA7AE;
    if (chr == 0x26B) return 0x2C62;
    if (chr == 0x26C) return 0xA7AD;
    if (chr == 0x26F) return 0x19C;
    if (chr == 0x271) return 0x2C6E;
    if (chr == 0x272) return 0x19D;
    if (chr == 0x275) return 0x19F;
    if (chr == 0x27D) return 0x2C64;
    if (chr == 0x280) return 0x1A6;
    if (chr == 0x282) return 0xA7C5;
    if (chr == 0x283) return 0x1A9;
    if (chr == 0x287) return 0xA7B1;
    if (chr == 0x288) return 0x1AE;
    if (chr == 0x289) return 0x244;
    if (chr == 0x28A) return 0x1B1;
    if (chr == 0x28B) return 0x1B2;
    if (chr == 0x28C) return 0x245;
    if (chr == 0x292) return 0x1B7;
    if (chr == 0x29D) return 0xA7B2;
    if (chr == 0x29E) return 0xA7B0;
  }
  if (hi == 0x3) {
    if (chr == 0x345) return 0x399;
    if (chr == 0x37B) return 0x3FD;
    if (chr == 0x37C) return 0x3FE;
    if (chr == 0x37D) return 0x3FF;
    if (chr == 0x3AC) return 0x386;
    if (chr == 0x3AD) return 0x388;
    if (chr == 0x3AE) return 0x389;
    if (chr == 0x3AF) return 0x38A;
    if (chr == 0x3C2) return 0x3A3;
    if (chr == 0x3CC) return 0x38C;
    if (chr == 0x3CD) return 0x38E;
    if (chr == 0x3CE) return 0x38F;
    if (chr == 0x3D0) return 0x392;
    if (chr == 0x3D1) return 0x398;
    if (chr == 0x3D5) return 0x3A6;
    if (chr == 0x3D6) return 0x3A0;
    if (chr == 0x3D7) return 0x3CF;
    if (chr == 0x3F0) return 0x39A;
    if (chr == 0x3F2) return 0x3F9;
    if (chr == 0x3F3) return 0x37F;
    if (chr == 0x3F5) return 0x395;
  }
  if (hi == 0x4) {
    if (chr == 0x4CF) return 0x4C0;
  }
  if (hi == 0x5) {
    if (chr == 0x561) return 0x531;
    if (chr == 0x562) return 0x532;
    if (chr == 0x563) return 0x533;
    if (chr == 0x564) return 0x534;
    if (chr == 0x565) return 0x535;
    if (chr == 0x566) return 0x536;
    if (chr == 0x567) return 0x537;
    if (chr == 0x568) return 0x538;
    if (chr == 0x569) return 0x539;
    if (chr == 0x56A) return 0x53A;
    if (chr == 0x56B) return 0x53B;
    if (chr == 0x56C) return 0x53C;
    if (chr == 0x56D) return 0x53D;
    if (chr == 0x56E) return 0x53E;
    if (chr == 0x56F) return 0x53F;
    if (chr == 0x570) return 0x540;
    if (chr == 0x571) return 0x541;
    if (chr == 0x572) return 0x542;
    if (chr == 0x573) return 0x543;
    if (chr == 0x574) return 0x544;
    if (chr == 0x575) return 0x545;
    if (chr == 0x576) return 0x546;
    if (chr == 0x577) return 0x547;
    if (chr == 0x578) return 0x548;
    if (chr == 0x579) return 0x549;
    if (chr == 0x57A) return 0x54A;
    if (chr == 0x57B) return 0x54B;
    if (chr == 0x57C) return 0x54C;
    if (chr == 0x57D) return 0x54D;
    if (chr == 0x57E) return 0x54E;
    if (chr == 0x57F) return 0x54F;
    if (chr == 0x580) return 0x550;
    if (chr == 0x581) return 0x551;
    if (chr == 0x582) return 0x552;
    if (chr == 0x583) return 0x553;
    if (chr == 0x584) return 0x554;
    if (chr == 0x585) return 0x555;
    if (chr == 0x586) return 0x556;
  }
  if (hi == 0x10) {
    if (chr == 0x10D0) return 0x1C90;
    if (chr == 0x10D1) return 0x1C91;
    if (chr == 0x10D2) return 0x1C92;
    if (chr == 0x10D3) return 0x1C93;
    if (chr == 0x10D4) return 0x1C94;
    if (chr == 0x10D5) return 0x1C95;
    if (chr == 0x10D6) return 0x1C96;
    if (chr == 0x10D7) return 0x1C97;
    if (chr == 0x10D8) return 0x1C98;
    if (chr == 0x10D9) return 0x1C99;
    if (chr == 0x10DA) return 0x1C9A;
    if (chr == 0x10DB) return 0x1C9B;
    if (chr == 0x10DC) return 0x1C9C;
    if (chr == 0x10DD) return 0x1C9D;
    if (chr == 0x10DE) return 0x1C9E;
    if (chr == 0x10DF) return 0x1C9F;
    if (chr == 0x10E0) return 0x1CA0;
    if (chr == 0x10E1) return 0x1CA1;
    if (chr == 0x10E2) return 0x1CA2;
    if (chr == 0x10E3) return 0x1CA3;
    if (chr == 0x10E4) return 0x1CA4;
    if (chr == 0x10E5) return 0x1CA5;
    if (chr == 0x10E6) return 0x1CA6;
    if (chr == 0x10E7) return 0x1CA7;
    if (chr == 0x10E8) return 0x1CA8;
    if (chr == 0x10E9) return 0x1CA9;
    if (chr == 0x10EA) return 0x1CAA;
    if (chr == 0x10EB) return 0x1CAB;
    if (chr == 0x10EC) return 0x1CAC;
    if (chr == 0x10ED) return 0x1CAD;
    if (chr == 0x10EE) return 0x1CAE;
    if (chr == 0x10EF) return 0x1CAF;
    if (chr == 0x10F0) return 0x1CB0;
    if (chr == 0x10F1) return 0x1CB1;
    if (chr == 0x10F2) return 0x1CB2;
    if (chr == 0x10F3) return 0x1CB3;
    if (chr == 0x10F4) return 0x1CB4;
    if (chr == 0x10F5) return 0x1CB5;
    if (chr == 0x10F6) return 0x1CB6;
    if (chr == 0x10F7) return 0x1CB7;
    if (chr == 0x10F8) return 0x1CB8;
    if (chr == 0x10F9) return 0x1CB9;
    if (chr == 0x10FA) return 0x1CBA;
    if (chr == 0x10FD) return 0x1CBD;
    if (chr == 0x10FE) return 0x1CBE;
    if (chr == 0x10FF) return 0x1CBF;
  }
  if (hi == 0x13) {
    if (chr == 0x13F8) return 0x13F0;
    if (chr == 0x13F9) return 0x13F1;
    if (chr == 0x13FA) return 0x13F2;
    if (chr == 0x13FB) return 0x13F3;
    if (chr == 0x13FC) return 0x13F4;
    if (chr == 0x13FD) return 0x13F5;
  }
  if (hi == 0x1C) {
    if (chr == 0x1C80) return 0x412;
    if (chr == 0x1C81) return 0x414;
    if (chr == 0x1C82) return 0x41E;
    if (chr == 0x1C83) return 0x421;
    if (chr == 0x1C84) return 0x422;
    if (chr == 0x1C85) return 0x422;
    if (chr == 0x1C86) return 0x42A;
    if (chr == 0x1C87) return 0x462;
    if (chr == 0x1C88) return 0xA64A;
  }
  if (hi == 0x1D) {
    if (chr == 0x1D79) return 0xA77D;
    if (chr == 0x1D7D) return 0x2C63;
    if (chr == 0x1D8E) return 0xA7C6;
  }
  if (hi == 0x1E) {
    if (chr == 0x1E9B) return 0x1E60;
  }
  if (hi == 0x1F) {
    if (chr == 0x1F00) return 0x1F08;
    if (chr == 0x1F01) return 0x1F09;
    if (chr == 0x1F02) return 0x1F0A;
    if (chr == 0x1F03) return 0x1F0B;
    if (chr == 0x1F04) return 0x1F0C;
    if (chr == 0x1F05) return 0x1F0D;
    if (chr == 0x1F06) return 0x1F0E;
    if (chr == 0x1F07) return 0x1F0F;
    if (chr == 0x1F10) return 0x1F18;
    if (chr == 0x1F11) return 0x1F19;
    if (chr == 0x1F12) return 0x1F1A;
    if (chr == 0x1F13) return 0x1F1B;
    if (chr == 0x1F14) return 0x1F1C;
    if (chr == 0x1F15) return 0x1F1D;
    if (chr == 0x1F20) return 0x1F28;
    if (chr == 0x1F21) return 0x1F29;
    if (chr == 0x1F22) return 0x1F2A;
    if (chr == 0x1F23) return 0x1F2B;
    if (chr == 0x1F24) return 0x1F2C;
    if (chr == 0x1F25) return 0x1F2D;
    if (chr == 0x1F26) return 0x1F2E;
    if (chr == 0x1F27) return 0x1F2F;
    if (chr == 0x1F30) return 0x1F38;
    if (chr == 0x1F31) return 0x1F39;
    if (chr == 0x1F32) return 0x1F3A;
    if (chr == 0x1F33) return 0x1F3B;
    if (chr == 0x1F34) return 0x1F3C;
    if (chr == 0x1F35) return 0x1F3D;
    if (chr == 0x1F36) return 0x1F3E;
    if (chr == 0x1F37) return 0x1F3F;
    if (chr == 0x1F40) return 0x1F48;
    if (chr == 0x1F41) return 0x1F49;
    if (chr == 0x1F42) return 0x1F4A;
    if (chr == 0x1F43) return 0x1F4B;
    if (chr == 0x1F44) return 0x1F4C;
    if (chr == 0x1F45) return 0x1F4D;
    if (chr == 0x1F51) return 0x1F59;
    if (chr == 0x1F53) return 0x1F5B;
    if (chr == 0x1F55) return 0x1F5D;
    if (chr == 0x1F57) return 0x1F5F;
    if (chr == 0x1F60) return 0x1F68;
    if (chr == 0x1F61) return 0x1F69;
    if (chr == 0x1F62) return 0x1F6A;
    if (chr == 0x1F63) return 0x1F6B;
    if (chr == 0x1F64) return 0x1F6C;
    if (chr == 0x1F65) return 0x1F6D;
    if (chr == 0x1F66) return 0x1F6E;
    if (chr == 0x1F67) return 0x1F6F;
    if (chr == 0x1F70) return 0x1FBA;
    if (chr == 0x1F71) return 0x1FBB;
    if (chr == 0x1F72) return 0x1FC8;
    if (chr == 0x1F73) return 0x1FC9;
    if (chr == 0x1F74) return 0x1FCA;
    if (chr == 0x1F75) return 0x1FCB;
    if (chr == 0x1F76) return 0x1FDA;
    if (chr == 0x1F77) return 0x1FDB;
    if (chr == 0x1F78) return 0x1FF8;
    if (chr == 0x1F79) return 0x1FF9;
    if (chr == 0x1F7A) return 0x1FEA;
    if (chr == 0x1F7B) return 0x1FEB;
    if (chr == 0x1F7C) return 0x1FFA;
    if (chr == 0x1F7D) return 0x1FFB;
    if (chr == 0x1FB0) return 0x1FB8;
    if (chr == 0x1FB1) return 0x1FB9;
    if (chr == 0x1FBE) return 0x399;
    if (chr == 0x1FD0) return 0x1FD8;
    if (chr == 0x1FD1) return 0x1FD9;
    if (chr == 0x1FE0) return 0x1FE8;
    if (chr == 0x1FE1) return 0x1FE9;
    if (chr == 0x1FE5) return 0x1FEC;
  }
  if (hi == 0x21) {
    if (chr == 0x214E) return 0x2132;
    if (chr == 0x2170) return 0x2160;
    if (chr == 0x2171) return 0x2161;
    if (chr == 0x2172) return 0x2162;
    if (chr == 0x2173) return 0x2163;
    if (chr == 0x2174) return 0x2164;
    if (chr == 0x2175) return 0x2165;
    if (chr == 0x2176) return 0x2166;
    if (chr == 0x2177) return 0x2167;
    if (chr == 0x2178) return 0x2168;
    if (chr == 0x2179) return 0x2169;
    if (chr == 0x217A) return 0x216A;
    if (chr == 0x217B) return 0x216B;
    if (chr == 0x217C) return 0x216C;
    if (chr == 0x217D) return 0x216D;
    if (chr == 0x217E) return 0x216E;
    if (chr == 0x217F) return 0x216F;
  }
  if (hi == 0x24) {
    if (chr == 0x24D0) return 0x24B6;
    if (chr == 0x24D1) return 0x24B7;
    if (chr == 0x24D2) return 0x24B8;
    if (chr == 0x24D3) return 0x24B9;
    if (chr == 0x24D4) return 0x24BA;
    if (chr == 0x24D5) return 0x24BB;
    if (chr == 0x24D6) return 0x24BC;
    if (chr == 0x24D7) return 0x24BD;
    if (chr == 0x24D8) return 0x24BE;
    if (chr == 0x24D9) return 0x24BF;
    if (chr == 0x24DA) return 0x24C0;
    if (chr == 0x24DB) return 0x24C1;
    if (chr == 0x24DC) return 0x24C2;
    if (chr == 0x24DD) return 0x24C3;
    if (chr == 0x24DE) return 0x24C4;
    if (chr == 0x24DF) return 0x24C5;
    if (chr == 0x24E0) return 0x24C6;
    if (chr == 0x24E1) return 0x24C7;
    if (chr == 0x24E2) return 0x24C8;
    if (chr == 0x24E3) return 0x24C9;
    if (chr == 0x24E4) return 0x24CA;
    if (chr == 0x24E5) return 0x24CB;
    if (chr == 0x24E6) return 0x24CC;
    if (chr == 0x24E7) return 0x24CD;
    if (chr == 0x24E8) return 0x24CE;
    if (chr == 0x24E9) return 0x24CF;
  }
  if (hi == 0x2C) {
    if (chr == 0x2C30) return 0x2C00;
    if (chr == 0x2C31) return 0x2C01;
    if (chr == 0x2C32) return 0x2C02;
    if (chr == 0x2C33) return 0x2C03;
    if (chr == 0x2C34) return 0x2C04;
    if (chr == 0x2C35) return 0x2C05;
    if (chr == 0x2C36) return 0x2C06;
    if (chr == 0x2C37) return 0x2C07;
    if (chr == 0x2C38) return 0x2C08;
    if (chr == 0x2C39) return 0x2C09;
    if (chr == 0x2C3A) return 0x2C0A;
    if (chr == 0x2C3B) return 0x2C0B;
    if (chr == 0x2C3C) return 0x2C0C;
    if (chr == 0x2C3D) return 0x2C0D;
    if (chr == 0x2C3E) return 0x2C0E;
    if (chr == 0x2C3F) return 0x2C0F;
    if (chr == 0x2C40) return 0x2C10;
    if (chr == 0x2C41) return 0x2C11;
    if (chr == 0x2C42) return 0x2C12;
    if (chr == 0x2C43) return 0x2C13;
    if (chr == 0x2C44) return 0x2C14;
    if (chr == 0x2C45) return 0x2C15;
    if (chr == 0x2C46) return 0x2C16;
    if (chr == 0x2C47) return 0x2C17;
    if (chr == 0x2C48) return 0x2C18;
    if (chr == 0x2C49) return 0x2C19;
    if (chr == 0x2C4A) return 0x2C1A;
    if (chr == 0x2C4B) return 0x2C1B;
    if (chr == 0x2C4C) return 0x2C1C;
    if (chr == 0x2C4D) return 0x2C1D;
    if (chr == 0x2C4E) return 0x2C1E;
    if (chr == 0x2C4F) return 0x2C1F;
    if (chr == 0x2C50) return 0x2C20;
    if (chr == 0x2C51) return 0x2C21;
    if (chr == 0x2C52) return 0x2C22;
    if (chr == 0x2C53) return 0x2C23;
    if (chr == 0x2C54) return 0x2C24;
    if (chr == 0x2C55) return 0x2C25;
    if (chr == 0x2C56) return 0x2C26;
    if (chr == 0x2C57) return 0x2C27;
    if (chr == 0x2C58) return 0x2C28;
    if (chr == 0x2C59) return 0x2C29;
    if (chr == 0x2C5A) return 0x2C2A;
    if (chr == 0x2C5B) return 0x2C2B;
    if (chr == 0x2C5C) return 0x2C2C;
    if (chr == 0x2C5D) return 0x2C2D;
    if (chr == 0x2C5E) return 0x2C2E;
    if (chr == 0x2C5F) return 0x2C2F;
    if (chr == 0x2C65) return 0x23A;
    if (chr == 0x2C66) return 0x23E;
  }
  if (hi == 0x2D) {
    if (chr == 0x2D00) return 0x10A0;
    if (chr == 0x2D01) return 0x10A1;
    if (chr == 0x2D02) return 0x10A2;
    if (chr == 0x2D03) return 0x10A3;
    if (chr == 0x2D04) return 0x10A4;
    if (chr == 0x2D05) return 0x10A5;
    if (chr == 0x2D06) return 0x10A6;
    if (chr == 0x2D07) return 0x10A7;
    if (chr == 0x2D08) return 0x10A8;
    if (chr == 0x2D09) return 0x10A9;
    if (chr == 0x2D0A) return 0x10AA;
    if (chr == 0x2D0B) return 0x10AB;
    if (chr == 0x2D0C) return 0x10AC;
    if (chr == 0x2D0D) return 0x10AD;
    if (chr == 0x2D0E) return 0x10AE;
    if (chr == 0x2D0F) return 0x10AF;
    if (chr == 0x2D10) return 0x10B0;
    if (chr == 0x2D11) return 0x10B1;
    if (chr == 0x2D12) return 0x10B2;
    if (chr == 0x2D13) return 0x10B3;
    if (chr == 0x2D14) return 0x10B4;
    if (chr == 0x2D15) return 0x10B5;
    if (chr == 0x2D16) return 0x10B6;
    if (chr == 0x2D17) return 0x10B7;
    if (chr == 0x2D18) return 0x10B8;
    if (chr == 0x2D19) return 0x10B9;
    if (chr == 0x2D1A) return 0x10BA;
    if (chr == 0x2D1B) return 0x10BB;
    if (chr == 0x2D1C) return 0x10BC;
    if (chr == 0x2D1D) return 0x10BD;
    if (chr == 0x2D1E) return 0x10BE;
    if (chr == 0x2D1F) return 0x10BF;
    if (chr == 0x2D20) return 0x10C0;
    if (chr == 0x2D21) return 0x10C1;
    if (chr == 0x2D22) return 0x10C2;
    if (chr == 0x2D23) return 0x10C3;
    if (chr == 0x2D24) return 0x10C4;
    if (chr == 0x2D25) return 0x10C5;
    if (chr == 0x2D27) return 0x10C7;
    if (chr == 0x2D2D) return 0x10CD;
  }
  if (hi == 0xA7) {
    if (chr == 0xA794) return 0xA7C4;
  }
  if (hi == 0xAB) {
    if (chr == 0xAB53) return 0xA7B3;
    if (chr == 0xAB70) return 0x13A0;
    if (chr == 0xAB71) return 0x13A1;
    if (chr == 0xAB72) return 0x13A2;
    if (chr == 0xAB73) return 0x13A3;
    if (chr == 0xAB74) return 0x13A4;
    if (chr == 0xAB75) return 0x13A5;
    if (chr == 0xAB76) return 0x13A6;
    if (chr == 0xAB77) return 0x13A7;
    if (chr == 0xAB78) return 0x13A8;
    if (chr == 0xAB79) return 0x13A9;
    if (chr == 0xAB7A) return 0x13AA;
    if (chr == 0xAB7B) return 0x13AB;
    if (chr == 0xAB7C) return 0x13AC;
    if (chr == 0xAB7D) return 0x13AD;
    if (chr == 0xAB7E) return 0x13AE;
    if (chr == 0xAB7F) return 0x13AF;
    if (chr == 0xAB80) return 0x13B0;
    if (chr == 0xAB81) return 0x13B1;
    if (chr == 0xAB82) return 0x13B2;
    if (chr == 0xAB83) return 0x13B3;
    if (chr == 0xAB84) return 0x13B4;
    if (chr == 0xAB85) return 0x13B5;
    if (chr == 0xAB86) return 0x13B6;
    if (chr == 0xAB87) return 0x13B7;
    if (chr == 0xAB88) return 0x13B8;
    if (chr == 0xAB89) return 0x13B9;
    if (chr == 0xAB8A) return 0x13BA;
    if (chr == 0xAB8B) return 0x13BB;
    if (chr == 0xAB8C) return 0x13BC;
    if (chr == 0xAB8D) return 0x13BD;
    if (chr == 0xAB8E) return 0x13BE;
    if (chr == 0xAB8F) return 0x13BF;
    if (chr == 0xAB90) return 0x13C0;
    if (chr == 0xAB91) return 0x13C1;
    if (chr == 0xAB92) return 0x13C2;
    if (chr == 0xAB93) return 0x13C3;
    if (chr == 0xAB94) return 0x13C4;
    if (chr == 0xAB95) return 0x13C5;
    if (chr == 0xAB96) return 0x13C6;
    if (chr == 0xAB97) return 0x13C7;
    if (chr == 0xAB98) return 0x13C8;
    if (chr == 0xAB99) return 0x13C9;
    if (chr == 0xAB9A) return 0x13CA;
    if (chr == 0xAB9B) return 0x13CB;
    if (chr == 0xAB9C) return 0x13CC;
    if (chr == 0xAB9D) return 0x13CD;
    if (chr == 0xAB9E) return 0x13CE;
    if (chr == 0xAB9F) return 0x13CF;
    if (chr == 0xABA0) return 0x13D0;
    if (chr == 0xABA1) return 0x13D1;
    if (chr == 0xABA2) return 0x13D2;
    if (chr == 0xABA3) return 0x13D3;
    if (chr == 0xABA4) return 0x13D4;
    if (chr == 0xABA5) return 0x13D5;
    if (chr == 0xABA6) return 0x13D6;
    if (chr == 0xABA7) return 0x13D7;
    if (chr == 0xABA8) return 0x13D8;
    if (chr == 0xABA9) return 0x13D9;
    if (chr == 0xABAA) return 0x13DA;
    if (chr == 0xABAB) return 0x13DB;
    if (chr == 0xABAC) return 0x13DC;
    if (chr == 0xABAD) return 0x13DD;
    if (chr == 0xABAE) return 0x13DE;
    if (chr == 0xABAF) return 0x13DF;
    if (chr == 0xABB0) return 0x13E0;
    if (chr == 0xABB1) return 0x13E1;
    if (chr == 0xABB2) return 0x13E2;
    if (chr == 0xABB3) return 0x13E3;
    if (chr == 0xABB4) return 0x13E4;
    if (chr == 0xABB5) return 0x13E5;
    if (chr == 0xABB6) return 0x13E6;
    if (chr == 0xABB7) return 0x13E7;
    if (chr == 0xABB8) return 0x13E8;
    if (chr == 0xABB9) return 0x13E9;
    if (chr == 0xABBA) return 0x13EA;
    if (chr == 0xABBB) return 0x13EB;
    if (chr == 0xABBC) return 0x13EC;
    if (chr == 0xABBD) return 0x13ED;
    if (chr == 0xABBE) return 0x13EE;
    if (chr == 0xABBF) return 0x13EF;
  }
  return -1;
};

// Special lowercase table lookup (475 entries)
export const __Porffor_lowercase_table = (chr: i32): i32 => {
  const hi: i32 = chr >> 8;
  if (hi == 0x1) {
    if (chr == 0x178) return 0xFF;
    if (chr == 0x181) return 0x253;
    if (chr == 0x186) return 0x254;
    if (chr == 0x189) return 0x256;
    if (chr == 0x18A) return 0x257;
    if (chr == 0x18E) return 0x1DD;
    if (chr == 0x18F) return 0x259;
    if (chr == 0x190) return 0x25B;
    if (chr == 0x193) return 0x260;
    if (chr == 0x194) return 0x263;
    if (chr == 0x196) return 0x269;
    if (chr == 0x197) return 0x268;
    if (chr == 0x19C) return 0x26F;
    if (chr == 0x19D) return 0x272;
    if (chr == 0x19F) return 0x275;
    if (chr == 0x1A6) return 0x280;
    if (chr == 0x1A9) return 0x283;
    if (chr == 0x1AE) return 0x288;
    if (chr == 0x1B1) return 0x28A;
    if (chr == 0x1B2) return 0x28B;
    if (chr == 0x1B7) return 0x292;
    if (chr == 0x1C4) return 0x1C6;
    if (chr == 0x1C7) return 0x1C9;
    if (chr == 0x1CA) return 0x1CC;
    if (chr == 0x1F1) return 0x1F3;
    if (chr == 0x1F6) return 0x195;
    if (chr == 0x1F7) return 0x1BF;
  }
  if (hi == 0x2) {
    if (chr == 0x220) return 0x19E;
    if (chr == 0x23A) return 0x2C65;
    if (chr == 0x23D) return 0x19A;
    if (chr == 0x23E) return 0x2C66;
    if (chr == 0x243) return 0x180;
    if (chr == 0x244) return 0x289;
    if (chr == 0x245) return 0x28C;
  }
  if (hi == 0x3) {
    if (chr == 0x37F) return 0x3F3;
    if (chr == 0x386) return 0x3AC;
    if (chr == 0x388) return 0x3AD;
    if (chr == 0x389) return 0x3AE;
    if (chr == 0x38A) return 0x3AF;
    if (chr == 0x38C) return 0x3CC;
    if (chr == 0x38E) return 0x3CD;
    if (chr == 0x38F) return 0x3CE;
    if (chr == 0x3CF) return 0x3D7;
    if (chr == 0x3F4) return 0x3B8;
    if (chr == 0x3F9) return 0x3F2;
    if (chr == 0x3FD) return 0x37B;
    if (chr == 0x3FE) return 0x37C;
    if (chr == 0x3FF) return 0x37D;
  }
  if (hi == 0x4) {
    if (chr == 0x4C0) return 0x4CF;
  }
  if (hi == 0x5) {
    if (chr == 0x531) return 0x561;
    if (chr == 0x532) return 0x562;
    if (chr == 0x533) return 0x563;
    if (chr == 0x534) return 0x564;
    if (chr == 0x535) return 0x565;
    if (chr == 0x536) return 0x566;
    if (chr == 0x537) return 0x567;
    if (chr == 0x538) return 0x568;
    if (chr == 0x539) return 0x569;
    if (chr == 0x53A) return 0x56A;
    if (chr == 0x53B) return 0x56B;
    if (chr == 0x53C) return 0x56C;
    if (chr == 0x53D) return 0x56D;
    if (chr == 0x53E) return 0x56E;
    if (chr == 0x53F) return 0x56F;
    if (chr == 0x540) return 0x570;
    if (chr == 0x541) return 0x571;
    if (chr == 0x542) return 0x572;
    if (chr == 0x543) return 0x573;
    if (chr == 0x544) return 0x574;
    if (chr == 0x545) return 0x575;
    if (chr == 0x546) return 0x576;
    if (chr == 0x547) return 0x577;
    if (chr == 0x548) return 0x578;
    if (chr == 0x549) return 0x579;
    if (chr == 0x54A) return 0x57A;
    if (chr == 0x54B) return 0x57B;
    if (chr == 0x54C) return 0x57C;
    if (chr == 0x54D) return 0x57D;
    if (chr == 0x54E) return 0x57E;
    if (chr == 0x54F) return 0x57F;
    if (chr == 0x550) return 0x580;
    if (chr == 0x551) return 0x581;
    if (chr == 0x552) return 0x582;
    if (chr == 0x553) return 0x583;
    if (chr == 0x554) return 0x584;
    if (chr == 0x555) return 0x585;
    if (chr == 0x556) return 0x586;
  }
  if (hi == 0x10) {
    if (chr == 0x10A0) return 0x2D00;
    if (chr == 0x10A1) return 0x2D01;
    if (chr == 0x10A2) return 0x2D02;
    if (chr == 0x10A3) return 0x2D03;
    if (chr == 0x10A4) return 0x2D04;
    if (chr == 0x10A5) return 0x2D05;
    if (chr == 0x10A6) return 0x2D06;
    if (chr == 0x10A7) return 0x2D07;
    if (chr == 0x10A8) return 0x2D08;
    if (chr == 0x10A9) return 0x2D09;
    if (chr == 0x10AA) return 0x2D0A;
    if (chr == 0x10AB) return 0x2D0B;
    if (chr == 0x10AC) return 0x2D0C;
    if (chr == 0x10AD) return 0x2D0D;
    if (chr == 0x10AE) return 0x2D0E;
    if (chr == 0x10AF) return 0x2D0F;
    if (chr == 0x10B0) return 0x2D10;
    if (chr == 0x10B1) return 0x2D11;
    if (chr == 0x10B2) return 0x2D12;
    if (chr == 0x10B3) return 0x2D13;
    if (chr == 0x10B4) return 0x2D14;
    if (chr == 0x10B5) return 0x2D15;
    if (chr == 0x10B6) return 0x2D16;
    if (chr == 0x10B7) return 0x2D17;
    if (chr == 0x10B8) return 0x2D18;
    if (chr == 0x10B9) return 0x2D19;
    if (chr == 0x10BA) return 0x2D1A;
    if (chr == 0x10BB) return 0x2D1B;
    if (chr == 0x10BC) return 0x2D1C;
    if (chr == 0x10BD) return 0x2D1D;
    if (chr == 0x10BE) return 0x2D1E;
    if (chr == 0x10BF) return 0x2D1F;
    if (chr == 0x10C0) return 0x2D20;
    if (chr == 0x10C1) return 0x2D21;
    if (chr == 0x10C2) return 0x2D22;
    if (chr == 0x10C3) return 0x2D23;
    if (chr == 0x10C4) return 0x2D24;
    if (chr == 0x10C5) return 0x2D25;
    if (chr == 0x10C7) return 0x2D27;
    if (chr == 0x10CD) return 0x2D2D;
  }
  if (hi == 0x13) {
    if (chr == 0x13A0) return 0xAB70;
    if (chr == 0x13A1) return 0xAB71;
    if (chr == 0x13A2) return 0xAB72;
    if (chr == 0x13A3) return 0xAB73;
    if (chr == 0x13A4) return 0xAB74;
    if (chr == 0x13A5) return 0xAB75;
    if (chr == 0x13A6) return 0xAB76;
    if (chr == 0x13A7) return 0xAB77;
    if (chr == 0x13A8) return 0xAB78;
    if (chr == 0x13A9) return 0xAB79;
    if (chr == 0x13AA) return 0xAB7A;
    if (chr == 0x13AB) return 0xAB7B;
    if (chr == 0x13AC) return 0xAB7C;
    if (chr == 0x13AD) return 0xAB7D;
    if (chr == 0x13AE) return 0xAB7E;
    if (chr == 0x13AF) return 0xAB7F;
    if (chr == 0x13B0) return 0xAB80;
    if (chr == 0x13B1) return 0xAB81;
    if (chr == 0x13B2) return 0xAB82;
    if (chr == 0x13B3) return 0xAB83;
    if (chr == 0x13B4) return 0xAB84;
    if (chr == 0x13B5) return 0xAB85;
    if (chr == 0x13B6) return 0xAB86;
    if (chr == 0x13B7) return 0xAB87;
    if (chr == 0x13B8) return 0xAB88;
    if (chr == 0x13B9) return 0xAB89;
    if (chr == 0x13BA) return 0xAB8A;
    if (chr == 0x13BB) return 0xAB8B;
    if (chr == 0x13BC) return 0xAB8C;
    if (chr == 0x13BD) return 0xAB8D;
    if (chr == 0x13BE) return 0xAB8E;
    if (chr == 0x13BF) return 0xAB8F;
    if (chr == 0x13C0) return 0xAB90;
    if (chr == 0x13C1) return 0xAB91;
    if (chr == 0x13C2) return 0xAB92;
    if (chr == 0x13C3) return 0xAB93;
    if (chr == 0x13C4) return 0xAB94;
    if (chr == 0x13C5) return 0xAB95;
    if (chr == 0x13C6) return 0xAB96;
    if (chr == 0x13C7) return 0xAB97;
    if (chr == 0x13C8) return 0xAB98;
    if (chr == 0x13C9) return 0xAB99;
    if (chr == 0x13CA) return 0xAB9A;
    if (chr == 0x13CB) return 0xAB9B;
    if (chr == 0x13CC) return 0xAB9C;
    if (chr == 0x13CD) return 0xAB9D;
    if (chr == 0x13CE) return 0xAB9E;
    if (chr == 0x13CF) return 0xAB9F;
    if (chr == 0x13D0) return 0xABA0;
    if (chr == 0x13D1) return 0xABA1;
    if (chr == 0x13D2) return 0xABA2;
    if (chr == 0x13D3) return 0xABA3;
    if (chr == 0x13D4) return 0xABA4;
    if (chr == 0x13D5) return 0xABA5;
    if (chr == 0x13D6) return 0xABA6;
    if (chr == 0x13D7) return 0xABA7;
    if (chr == 0x13D8) return 0xABA8;
    if (chr == 0x13D9) return 0xABA9;
    if (chr == 0x13DA) return 0xABAA;
    if (chr == 0x13DB) return 0xABAB;
    if (chr == 0x13DC) return 0xABAC;
    if (chr == 0x13DD) return 0xABAD;
    if (chr == 0x13DE) return 0xABAE;
    if (chr == 0x13DF) return 0xABAF;
    if (chr == 0x13E0) return 0xABB0;
    if (chr == 0x13E1) return 0xABB1;
    if (chr == 0x13E2) return 0xABB2;
    if (chr == 0x13E3) return 0xABB3;
    if (chr == 0x13E4) return 0xABB4;
    if (chr == 0x13E5) return 0xABB5;
    if (chr == 0x13E6) return 0xABB6;
    if (chr == 0x13E7) return 0xABB7;
    if (chr == 0x13E8) return 0xABB8;
    if (chr == 0x13E9) return 0xABB9;
    if (chr == 0x13EA) return 0xABBA;
    if (chr == 0x13EB) return 0xABBB;
    if (chr == 0x13EC) return 0xABBC;
    if (chr == 0x13ED) return 0xABBD;
    if (chr == 0x13EE) return 0xABBE;
    if (chr == 0x13EF) return 0xABBF;
    if (chr == 0x13F0) return 0x13F8;
    if (chr == 0x13F1) return 0x13F9;
    if (chr == 0x13F2) return 0x13FA;
    if (chr == 0x13F3) return 0x13FB;
    if (chr == 0x13F4) return 0x13FC;
    if (chr == 0x13F5) return 0x13FD;
  }
  if (hi == 0x1C) {
    if (chr == 0x1C90) return 0x10D0;
    if (chr == 0x1C91) return 0x10D1;
    if (chr == 0x1C92) return 0x10D2;
    if (chr == 0x1C93) return 0x10D3;
    if (chr == 0x1C94) return 0x10D4;
    if (chr == 0x1C95) return 0x10D5;
    if (chr == 0x1C96) return 0x10D6;
    if (chr == 0x1C97) return 0x10D7;
    if (chr == 0x1C98) return 0x10D8;
    if (chr == 0x1C99) return 0x10D9;
    if (chr == 0x1C9A) return 0x10DA;
    if (chr == 0x1C9B) return 0x10DB;
    if (chr == 0x1C9C) return 0x10DC;
    if (chr == 0x1C9D) return 0x10DD;
    if (chr == 0x1C9E) return 0x10DE;
    if (chr == 0x1C9F) return 0x10DF;
    if (chr == 0x1CA0) return 0x10E0;
    if (chr == 0x1CA1) return 0x10E1;
    if (chr == 0x1CA2) return 0x10E2;
    if (chr == 0x1CA3) return 0x10E3;
    if (chr == 0x1CA4) return 0x10E4;
    if (chr == 0x1CA5) return 0x10E5;
    if (chr == 0x1CA6) return 0x10E6;
    if (chr == 0x1CA7) return 0x10E7;
    if (chr == 0x1CA8) return 0x10E8;
    if (chr == 0x1CA9) return 0x10E9;
    if (chr == 0x1CAA) return 0x10EA;
    if (chr == 0x1CAB) return 0x10EB;
    if (chr == 0x1CAC) return 0x10EC;
    if (chr == 0x1CAD) return 0x10ED;
    if (chr == 0x1CAE) return 0x10EE;
    if (chr == 0x1CAF) return 0x10EF;
    if (chr == 0x1CB0) return 0x10F0;
    if (chr == 0x1CB1) return 0x10F1;
    if (chr == 0x1CB2) return 0x10F2;
    if (chr == 0x1CB3) return 0x10F3;
    if (chr == 0x1CB4) return 0x10F4;
    if (chr == 0x1CB5) return 0x10F5;
    if (chr == 0x1CB6) return 0x10F6;
    if (chr == 0x1CB7) return 0x10F7;
    if (chr == 0x1CB8) return 0x10F8;
    if (chr == 0x1CB9) return 0x10F9;
    if (chr == 0x1CBA) return 0x10FA;
    if (chr == 0x1CBD) return 0x10FD;
    if (chr == 0x1CBE) return 0x10FE;
    if (chr == 0x1CBF) return 0x10FF;
  }
  if (hi == 0x1E) {
    if (chr == 0x1E9E) return 0xDF;
  }
  if (hi == 0x1F) {
    if (chr == 0x1F08) return 0x1F00;
    if (chr == 0x1F09) return 0x1F01;
    if (chr == 0x1F0A) return 0x1F02;
    if (chr == 0x1F0B) return 0x1F03;
    if (chr == 0x1F0C) return 0x1F04;
    if (chr == 0x1F0D) return 0x1F05;
    if (chr == 0x1F0E) return 0x1F06;
    if (chr == 0x1F0F) return 0x1F07;
    if (chr == 0x1F18) return 0x1F10;
    if (chr == 0x1F19) return 0x1F11;
    if (chr == 0x1F1A) return 0x1F12;
    if (chr == 0x1F1B) return 0x1F13;
    if (chr == 0x1F1C) return 0x1F14;
    if (chr == 0x1F1D) return 0x1F15;
    if (chr == 0x1F28) return 0x1F20;
    if (chr == 0x1F29) return 0x1F21;
    if (chr == 0x1F2A) return 0x1F22;
    if (chr == 0x1F2B) return 0x1F23;
    if (chr == 0x1F2C) return 0x1F24;
    if (chr == 0x1F2D) return 0x1F25;
    if (chr == 0x1F2E) return 0x1F26;
    if (chr == 0x1F2F) return 0x1F27;
    if (chr == 0x1F38) return 0x1F30;
    if (chr == 0x1F39) return 0x1F31;
    if (chr == 0x1F3A) return 0x1F32;
    if (chr == 0x1F3B) return 0x1F33;
    if (chr == 0x1F3C) return 0x1F34;
    if (chr == 0x1F3D) return 0x1F35;
    if (chr == 0x1F3E) return 0x1F36;
    if (chr == 0x1F3F) return 0x1F37;
    if (chr == 0x1F48) return 0x1F40;
    if (chr == 0x1F49) return 0x1F41;
    if (chr == 0x1F4A) return 0x1F42;
    if (chr == 0x1F4B) return 0x1F43;
    if (chr == 0x1F4C) return 0x1F44;
    if (chr == 0x1F4D) return 0x1F45;
    if (chr == 0x1F59) return 0x1F51;
    if (chr == 0x1F5B) return 0x1F53;
    if (chr == 0x1F5D) return 0x1F55;
    if (chr == 0x1F5F) return 0x1F57;
    if (chr == 0x1F68) return 0x1F60;
    if (chr == 0x1F69) return 0x1F61;
    if (chr == 0x1F6A) return 0x1F62;
    if (chr == 0x1F6B) return 0x1F63;
    if (chr == 0x1F6C) return 0x1F64;
    if (chr == 0x1F6D) return 0x1F65;
    if (chr == 0x1F6E) return 0x1F66;
    if (chr == 0x1F6F) return 0x1F67;
    if (chr == 0x1F88) return 0x1F80;
    if (chr == 0x1F89) return 0x1F81;
    if (chr == 0x1F8A) return 0x1F82;
    if (chr == 0x1F8B) return 0x1F83;
    if (chr == 0x1F8C) return 0x1F84;
    if (chr == 0x1F8D) return 0x1F85;
    if (chr == 0x1F8E) return 0x1F86;
    if (chr == 0x1F8F) return 0x1F87;
    if (chr == 0x1F98) return 0x1F90;
    if (chr == 0x1F99) return 0x1F91;
    if (chr == 0x1F9A) return 0x1F92;
    if (chr == 0x1F9B) return 0x1F93;
    if (chr == 0x1F9C) return 0x1F94;
    if (chr == 0x1F9D) return 0x1F95;
    if (chr == 0x1F9E) return 0x1F96;
    if (chr == 0x1F9F) return 0x1F97;
    if (chr == 0x1FA8) return 0x1FA0;
    if (chr == 0x1FA9) return 0x1FA1;
    if (chr == 0x1FAA) return 0x1FA2;
    if (chr == 0x1FAB) return 0x1FA3;
    if (chr == 0x1FAC) return 0x1FA4;
    if (chr == 0x1FAD) return 0x1FA5;
    if (chr == 0x1FAE) return 0x1FA6;
    if (chr == 0x1FAF) return 0x1FA7;
    if (chr == 0x1FB8) return 0x1FB0;
    if (chr == 0x1FB9) return 0x1FB1;
    if (chr == 0x1FBA) return 0x1F70;
    if (chr == 0x1FBB) return 0x1F71;
    if (chr == 0x1FBC) return 0x1FB3;
    if (chr == 0x1FC8) return 0x1F72;
    if (chr == 0x1FC9) return 0x1F73;
    if (chr == 0x1FCA) return 0x1F74;
    if (chr == 0x1FCB) return 0x1F75;
    if (chr == 0x1FCC) return 0x1FC3;
    if (chr == 0x1FD8) return 0x1FD0;
    if (chr == 0x1FD9) return 0x1FD1;
    if (chr == 0x1FDA) return 0x1F76;
    if (chr == 0x1FDB) return 0x1F77;
    if (chr == 0x1FE8) return 0x1FE0;
    if (chr == 0x1FE9) return 0x1FE1;
    if (chr == 0x1FEA) return 0x1F7A;
    if (chr == 0x1FEB) return 0x1F7B;
    if (chr == 0x1FEC) return 0x1FE5;
    if (chr == 0x1FF8) return 0x1F78;
    if (chr == 0x1FF9) return 0x1F79;
    if (chr == 0x1FFA) return 0x1F7C;
    if (chr == 0x1FFB) return 0x1F7D;
    if (chr == 0x1FFC) return 0x1FF3;
  }
  if (hi == 0x21) {
    if (chr == 0x2126) return 0x3C9;
    if (chr == 0x212A) return 0x6B;
    if (chr == 0x212B) return 0xE5;
    if (chr == 0x2132) return 0x214E;
    if (chr == 0x2160) return 0x2170;
    if (chr == 0x2161) return 0x2171;
    if (chr == 0x2162) return 0x2172;
    if (chr == 0x2163) return 0x2173;
    if (chr == 0x2164) return 0x2174;
    if (chr == 0x2165) return 0x2175;
    if (chr == 0x2166) return 0x2176;
    if (chr == 0x2167) return 0x2177;
    if (chr == 0x2168) return 0x2178;
    if (chr == 0x2169) return 0x2179;
    if (chr == 0x216A) return 0x217A;
    if (chr == 0x216B) return 0x217B;
    if (chr == 0x216C) return 0x217C;
    if (chr == 0x216D) return 0x217D;
    if (chr == 0x216E) return 0x217E;
    if (chr == 0x216F) return 0x217F;
    if (chr == 0x2183) return 0x2184;
  }
  if (hi == 0x24) {
    if (chr == 0x24B6) return 0x24D0;
    if (chr == 0x24B7) return 0x24D1;
    if (chr == 0x24B8) return 0x24D2;
    if (chr == 0x24B9) return 0x24D3;
    if (chr == 0x24BA) return 0x24D4;
    if (chr == 0x24BB) return 0x24D5;
    if (chr == 0x24BC) return 0x24D6;
    if (chr == 0x24BD) return 0x24D7;
    if (chr == 0x24BE) return 0x24D8;
    if (chr == 0x24BF) return 0x24D9;
    if (chr == 0x24C0) return 0x24DA;
    if (chr == 0x24C1) return 0x24DB;
    if (chr == 0x24C2) return 0x24DC;
    if (chr == 0x24C3) return 0x24DD;
    if (chr == 0x24C4) return 0x24DE;
    if (chr == 0x24C5) return 0x24DF;
    if (chr == 0x24C6) return 0x24E0;
    if (chr == 0x24C7) return 0x24E1;
    if (chr == 0x24C8) return 0x24E2;
    if (chr == 0x24C9) return 0x24E3;
    if (chr == 0x24CA) return 0x24E4;
    if (chr == 0x24CB) return 0x24E5;
    if (chr == 0x24CC) return 0x24E6;
    if (chr == 0x24CD) return 0x24E7;
    if (chr == 0x24CE) return 0x24E8;
    if (chr == 0x24CF) return 0x24E9;
  }
  if (hi == 0x2C) {
    if (chr == 0x2C00) return 0x2C30;
    if (chr == 0x2C01) return 0x2C31;
    if (chr == 0x2C02) return 0x2C32;
    if (chr == 0x2C03) return 0x2C33;
    if (chr == 0x2C04) return 0x2C34;
    if (chr == 0x2C05) return 0x2C35;
    if (chr == 0x2C06) return 0x2C36;
    if (chr == 0x2C07) return 0x2C37;
    if (chr == 0x2C08) return 0x2C38;
    if (chr == 0x2C09) return 0x2C39;
    if (chr == 0x2C0A) return 0x2C3A;
    if (chr == 0x2C0B) return 0x2C3B;
    if (chr == 0x2C0C) return 0x2C3C;
    if (chr == 0x2C0D) return 0x2C3D;
    if (chr == 0x2C0E) return 0x2C3E;
    if (chr == 0x2C0F) return 0x2C3F;
    if (chr == 0x2C10) return 0x2C40;
    if (chr == 0x2C11) return 0x2C41;
    if (chr == 0x2C12) return 0x2C42;
    if (chr == 0x2C13) return 0x2C43;
    if (chr == 0x2C14) return 0x2C44;
    if (chr == 0x2C15) return 0x2C45;
    if (chr == 0x2C16) return 0x2C46;
    if (chr == 0x2C17) return 0x2C47;
    if (chr == 0x2C18) return 0x2C48;
    if (chr == 0x2C19) return 0x2C49;
    if (chr == 0x2C1A) return 0x2C4A;
    if (chr == 0x2C1B) return 0x2C4B;
    if (chr == 0x2C1C) return 0x2C4C;
    if (chr == 0x2C1D) return 0x2C4D;
    if (chr == 0x2C1E) return 0x2C4E;
    if (chr == 0x2C1F) return 0x2C4F;
    if (chr == 0x2C20) return 0x2C50;
    if (chr == 0x2C21) return 0x2C51;
    if (chr == 0x2C22) return 0x2C52;
    if (chr == 0x2C23) return 0x2C53;
    if (chr == 0x2C24) return 0x2C54;
    if (chr == 0x2C25) return 0x2C55;
    if (chr == 0x2C26) return 0x2C56;
    if (chr == 0x2C27) return 0x2C57;
    if (chr == 0x2C28) return 0x2C58;
    if (chr == 0x2C29) return 0x2C59;
    if (chr == 0x2C2A) return 0x2C5A;
    if (chr == 0x2C2B) return 0x2C5B;
    if (chr == 0x2C2C) return 0x2C5C;
    if (chr == 0x2C2D) return 0x2C5D;
    if (chr == 0x2C2E) return 0x2C5E;
    if (chr == 0x2C2F) return 0x2C5F;
    if (chr == 0x2C62) return 0x26B;
    if (chr == 0x2C63) return 0x1D7D;
    if (chr == 0x2C64) return 0x27D;
    if (chr == 0x2C6D) return 0x251;
    if (chr == 0x2C6E) return 0x271;
    if (chr == 0x2C6F) return 0x250;
    if (chr == 0x2C70) return 0x252;
    if (chr == 0x2C7E) return 0x23F;
    if (chr == 0x2C7F) return 0x240;
  }
  if (hi == 0xA6) {
    if (chr == 0xA64A) return 0x1C88;
  }
  if (hi == 0xA7) {
    if (chr == 0xA77D) return 0x1D79;
    if (chr == 0xA78D) return 0x265;
    if (chr == 0xA7AA) return 0x266;
    if (chr == 0xA7AB) return 0x25C;
    if (chr == 0xA7AC) return 0x261;
    if (chr == 0xA7AD) return 0x26C;
    if (chr == 0xA7AE) return 0x26A;
    if (chr == 0xA7B0) return 0x29E;
    if (chr == 0xA7B1) return 0x287;
    if (chr == 0xA7B2) return 0x29D;
    if (chr == 0xA7B3) return 0xAB53;
    if (chr == 0xA7C4) return 0xA794;
    if (chr == 0xA7C5) return 0x282;
    if (chr == 0xA7C6) return 0x1D8E;
    if (chr == 0xA7CB) return 0x264;
    if (chr == 0xA7DC) return 0x19B;
  }
  return -1;
};

export const __Porffor_strcmp = (a: any, b: any): boolean => {
  // a and b must be string or bytestring
  // fast path: check if pointers are equal
  if (Porffor.wasm`local.get ${a}` == Porffor.wasm`local.get ${b}`) return true;

  let al: i32 = Porffor.wasm.i32.load(a, 0, 0);
  let bl: i32 = Porffor.wasm.i32.load(b, 0, 0);

  // fast path: check if lengths are inequal
  if (al != bl) return false;

  if (Porffor.wasm`local.get ${a+1}` == Porffor.TYPES.bytestring) {
    if (Porffor.wasm`local.get ${b+1}` == Porffor.TYPES.bytestring) {
      // bytestring, bytestring
      // this path is hyper-optimized as it is by far the most common and (perf) important

      let ap32: i32 = a - 28;
      let bp32: i32 = b - 28;
      let ap8: i32 = a - 4;
      let bp8: i32 = b - 4;
      Porffor.wasm`
;; load in 2 i64x2 chunks while length >= 32
local.get ${al}
i32.const 32
i32.ge_s
if 64
  loop 64
    local.get ${ap32}
    local.get ${al}
    i32.add
    v128.load 0 0

    local.get ${bp32}
    local.get ${al}
    i32.add
    v128.load 0 0
    v128.xor

    local.get ${ap32}
    local.get ${al}
    i32.add
    v128.load 0 16

    local.get ${bp32}
    local.get ${al}
    i32.add
    v128.load 0 16
    v128.xor

    v128.or
    v128.any_true
    if 64
      i32.const 0
      return
    end

    local.get ${al}
    i32.const 32
    i32.sub
    local.tee ${al}
    i32.const 32
    i32.ge_s
    br_if 0
  end
end

;; load in i64 chunks while length >= 8
local.get ${al}
i32.const 8
i32.ge_s
if 64
  loop 64
    local.get ${ap8}
    local.get ${al}
    i32.add
    i64.load 0 0

    local.get ${bp8}
    local.get ${al}
    i32.add
    i64.load 0 0

    i64.ne
    if 64
      i32.const 0
      return
    end

    local.get ${al}
    i32.const 8
    i32.sub
    local.tee ${al}
    i32.const 8
    i32.ge_s
    br_if 0
  end
end

;; load in u16 chunks while length >= 2
local.get ${al}
i32.const 2
i32.ge_s
if 64
  loop 64
    local.get ${a}
    local.get ${al}
    i32.add
    i32.load16_u 0 2

    local.get ${b}
    local.get ${al}
    i32.add
    i32.load16_u 0 2

    i32.ne
    if 64
      i32.const 0
      return
    end

    local.get ${al}
    i32.const 2
    i32.sub
    local.tee ${al}
    i32.const 2
    i32.ge_s
    br_if 0
  end
end`;

      // check bonus char if exists
      if (al == 1) {
        if (Porffor.wasm.i32.load8_u(Porffor.wasm`local.get ${a}`, 0, 4) !=
            Porffor.wasm.i32.load8_u(Porffor.wasm`local.get ${b}`, 0, 4)) return false;
      }
      return true;
    } else {
      // bytestring, string
      for (let i: i32 = 0; i < al; i++) {
        if (Porffor.wasm.i32.load8_u(Porffor.wasm`local.get ${a}` + i, 0, 4) !=
            Porffor.wasm.i32.load16_u(Porffor.wasm`local.get ${b}` + i*2, 0, 4)) return false;
      }
      return true;
    }
  } else {
    if (Porffor.wasm`local.get ${b+1}` == Porffor.TYPES.bytestring) {
      // string, bytestring
      for (let i: i32 = 0; i < al; i++) {
        if (Porffor.wasm.i32.load16_u(Porffor.wasm`local.get ${a}` + i*2, 0, 4) !=
            Porffor.wasm.i32.load8_u(Porffor.wasm`local.get ${b}` + i, 0, 4)) return false;
      }
      return true;
    } else {
      // string, string
      // change char lengths to byte lengths
      al *= 2;
      bl *= 2;

      // copied from bytestring, bytestring
      let ap32: i32 = a - 28;
      let bp32: i32 = b - 28;
      let ap8: i32 = a - 4;
      let bp8: i32 = b - 4;
      Porffor.wasm`
;; load in 2 i64x2 chunks while length >= 32
local.get ${al}
i32.const 32
i32.ge_s
if 64
  loop 64
    local.get ${ap32}
    local.get ${al}
    i32.add
    v128.load 0 0

    local.get ${bp32}
    local.get ${al}
    i32.add
    v128.load 0 0
    v128.xor

    local.get ${ap32}
    local.get ${al}
    i32.add
    v128.load 0 16

    local.get ${bp32}
    local.get ${al}
    i32.add
    v128.load 0 16
    v128.xor

    v128.or
    v128.any_true
    if 64
      i32.const 0
      return
    end

    local.get ${al}
    i32.const 32
    i32.sub
    local.tee ${al}
    i32.const 32
    i32.ge_s
    br_if 0
  end
end

;; load in i64 chunks while length >= 8
local.get ${al}
i32.const 8
i32.ge_s
if 64
  loop 64
    local.get ${ap8}
    local.get ${al}
    i32.add
    i64.load 0 0

    local.get ${bp8}
    local.get ${al}
    i32.add
    i64.load 0 0

    i64.ne
    if 64
      i32.const 0
      return
    end

    local.get ${al}
    i32.const 8
    i32.sub
    local.tee ${al}
    i32.const 8
    i32.ge_s
    br_if 0
  end
end

;; load in u16 chunks while length >= 2
local.get ${al}
i32.const 2
i32.ge_s
if 64
  loop 64
    local.get ${a}
    local.get ${al}
    i32.add
    i32.load16_u 0 2

    local.get ${b}
    local.get ${al}
    i32.add
    i32.load16_u 0 2

    i32.ne
    if 64
      i32.const 0
      return
    end

    local.get ${al}
    i32.const 2
    i32.sub
    local.tee ${al}
    i32.const 2
    i32.ge_s
    br_if 0
  end
end`;
      return true;
    }
  }
};

export const __Porffor_strcat = (a: any, b: any): any => {
  // a and b must be string or bytestring

  const al: i32 = Porffor.wasm.i32.load(a, 0, 0);
  const bl: i32 = Porffor.wasm.i32.load(b, 0, 0);

  if (Porffor.wasm`local.get ${a+1}` == Porffor.TYPES.bytestring) {
    if (Porffor.wasm`local.get ${b+1}` == Porffor.TYPES.bytestring) {
      // bytestring, bytestring
      const out: bytestring = Porffor.malloc(4 + al + bl);

      // out.length = a.length + b.length
      Porffor.wasm.i32.store(out, al + bl, 0, 0);

      // copy left (fast memcpy)
      Porffor.wasm.memory.copy(Porffor.wasm`local.get ${out}` + 4, Porffor.wasm`local.get ${a}` + 4, al, 0, 0);

      // copy right (fast memcpy)
      Porffor.wasm.memory.copy(Porffor.wasm`local.get ${out}` + 4 + al, Porffor.wasm`local.get ${b}` + 4, bl, 0, 0);

      return out;
    } else {
      // bytestring, string
      const out: string = Porffor.malloc(4 + (al + bl) * 2);

      // out.length = a.length + b.length
      Porffor.wasm.i32.store(out, al + bl, 0, 0);

      // copy left (slow bytestring -> string)
      for (let i: i32 = 0; i < al; i++) {
        Porffor.wasm.i32.store16(Porffor.wasm`local.get ${out}` + i*2, Porffor.wasm.i32.load8_u(Porffor.wasm`local.get ${a}` + i, 0, 4), 0, 4);
      }

      // copy right (fast memcpy)
      Porffor.wasm.memory.copy(Porffor.wasm`local.get ${out}` + 4 + al*2, Porffor.wasm`local.get ${b}` + 4, bl * 2, 0, 0);

      return out;
    }
  } else {
    if (Porffor.wasm`local.get ${b+1}` == Porffor.TYPES.bytestring) {
      // string, bytestring
      const out: string = Porffor.malloc(4 + (al + bl) * 2);

      // out.length = a.length + b.length
      Porffor.wasm.i32.store(out, al + bl, 0, 0);

      // copy left (fast memcpy)
      Porffor.wasm.memory.copy(Porffor.wasm`local.get ${out}` + 4, Porffor.wasm`local.get ${a}` + 4, al * 2, 0, 0);

      // copy right (slow bytestring -> string)
      let ptr: i32 = Porffor.wasm`local.get ${out}` + al*2;
      for (let i: i32 = 0; i < bl; i++) {
        Porffor.wasm.i32.store16(ptr + i*2, Porffor.wasm.i32.load8_u(Porffor.wasm`local.get ${b}` + i, 0, 4), 0, 4);
      }

      return out;
    } else {
      // string, string
      const out: string = Porffor.malloc(4 + (al + bl) * 2);

      // out.length = a.length + b.length
      Porffor.wasm.i32.store(out, al + bl, 0, 0);

      // copy left (fast memcpy)
      Porffor.wasm.memory.copy(Porffor.wasm`local.get ${out}` + 4, Porffor.wasm`local.get ${a}` + 4, al * 2, 0, 0);

      // copy right (fast memcpy)
      Porffor.wasm.memory.copy(Porffor.wasm`local.get ${out}` + 4 + al*2, Porffor.wasm`local.get ${b}` + 4, bl * 2, 0, 0);

      return out;
    }
  }
};


export const __String_prototype_at = (_this: string, index: any) => {
  index = ecma262.ToIntegerOrInfinity(index);

  const len: i32 = _this.length;

  if (index < 0) index = len + index;
  if (Porffor.fastOr(index < 0, index >= len)) return undefined;

  let out: string = Porffor.malloc(8);
  Porffor.wasm.i32.store(out, 1, 0, 0); // out.length = 1

  Porffor.wasm.i32.store16(
    Porffor.wasm`local.get ${out}`,
    Porffor.wasm.i32.load16_u(Porffor.wasm`local.get ${_this}` + index * 2, 0, 4),
    0, 4);

  return out;
};

export const __ByteString_prototype_at = (_this: bytestring, index: any) => {
  index = ecma262.ToIntegerOrInfinity(index);

  const len: i32 = _this.length;

  if (index < 0) index = len + index;
  if (Porffor.fastOr(index < 0, index >= len)) return undefined;

  let out: bytestring = Porffor.malloc(8);
  Porffor.wasm.i32.store(out, 1, 0, 0); // out.length = 1

  Porffor.wasm.i32.store8(
    Porffor.wasm`local.get ${out}`,
    Porffor.wasm.i32.load8_u(Porffor.wasm`local.get ${_this}` + index, 0, 4),
    0, 4);

  return out;
};

export const __String_prototype_charAt = (_this: string, index: any) => {
  index = ecma262.ToIntegerOrInfinity(index);

  const len: i32 = _this.length;

  if (Porffor.fastOr(index < 0, index >= len)) return '';

  let out: string = Porffor.malloc(8);
  Porffor.wasm.i32.store(out, 1, 0, 0); // out.length = 1

  Porffor.wasm.i32.store16(
    Porffor.wasm`local.get ${out}`,
    Porffor.wasm.i32.load16_u(Porffor.wasm`local.get ${_this}` + index * 2, 0, 4),
    0, 4);

  return out;
};

export const __ByteString_prototype_charAt = (_this: bytestring, index: any) => {
  index = ecma262.ToIntegerOrInfinity(index);

  const len: i32 = _this.length;

  if (Porffor.fastOr(index < 0, index >= len)) return '';

  let out: bytestring = Porffor.malloc(8);
  Porffor.wasm.i32.store(out, 1, 0, 0); // out.length = 1

  Porffor.wasm.i32.store8(
    Porffor.wasm`local.get ${out}`,
    Porffor.wasm.i32.load8_u(Porffor.wasm`local.get ${_this}` + index, 0, 4),
    0, 4);

  return out;
};

// Helper to get extra uppercase chars for multi-char mappings
// Returns 0 if no extra chars, otherwise packed: (char2 << 16) | char3, plus count in high bits
// The first char is returned by __Porffor_uppercase
export const __Porffor_uppercase_extra = (chr: i32): i32 => {
  // ß -> SS (U+00DF -> 0x53, 0x53)
  if (chr == 0x00DF) return 0x0053; // extra S

  // ʼn -> ʼN (U+0149 -> 0x2BC, 0x4E)
  if (chr == 0x0149) return 0x004E; // extra N

  // ǰ -> J̌ (U+01F0 -> 0x4A, 0x30C)
  if (chr == 0x01F0) return 0x030C; // extra combining caron

  // ΐ -> Ϊ́ (U+0390 -> 0x399, 0x308, 0x301) - 3 chars
  if (chr == 0x0390) return 0x03010308; // extra combining diaeresis + acute

  // ΰ -> Ϋ́ (U+03B0 -> 0x3A5, 0x308, 0x301) - 3 chars
  if (chr == 0x03B0) return 0x03010308;

  // և -> ԵՒ (U+0587 -> 0x535, 0x552)
  if (chr == 0x0587) return 0x0552;

  // ẖ -> H̱ (U+1E96 -> 0x48, 0x331)
  if (chr == 0x1E96) return 0x0331;

  // ẗ -> T̈ (U+1E97 -> 0x54, 0x308)
  if (chr == 0x1E97) return 0x0308;

  // ẘ -> W̊ (U+1E98 -> 0x57, 0x30A)
  if (chr == 0x1E98) return 0x030A;

  // ẙ -> Y̊ (U+1E99 -> 0x59, 0x30A)
  if (chr == 0x1E99) return 0x030A;

  // ẚ -> Aʾ (U+1E9A -> 0x41, 0x2BE)
  if (chr == 0x1E9A) return 0x02BE;

  // ὐ -> Υ̓ (U+1F50 -> 0x3A5, 0x313)
  if (chr == 0x1F50) return 0x0313;

  // ὒ -> Υ̓̀ (U+1F52 -> 0x3A5, 0x313, 0x300) - 3 chars
  if (chr == 0x1F52) return 0x03000313;

  // ὔ -> Υ̓́ (U+1F54 -> 0x3A5, 0x313, 0x301) - 3 chars
  if (chr == 0x1F54) return 0x03010313;

  // ὖ -> Υ̓͂ (U+1F56 -> 0x3A5, 0x313, 0x342) - 3 chars
  if (chr == 0x1F56) return 0x03420313;

  // Greek Extended with iota subscript (U+1F80-1F8F, 1F90-1F9F, 1FA0-1FAF) -> base + Ι
  if (chr >= 0x1F80 && chr <= 0x1F8F) return 0x0399;
  if (chr >= 0x1F90 && chr <= 0x1F9F) return 0x0399;
  if (chr >= 0x1FA0 && chr <= 0x1FAF) return 0x0399;

  // ᾲ -> ᾺΙ (U+1FB2 -> 0x1FBA, 0x399)
  if (chr == 0x1FB2) return 0x0399;
  // ᾳ -> ΑΙ (U+1FB3 -> 0x391, 0x399)
  if (chr == 0x1FB3) return 0x0399;
  // ᾴ -> ΆΙ (U+1FB4 -> 0x386, 0x399)
  if (chr == 0x1FB4) return 0x0399;
  // ᾶ -> Α͂ (U+1FB6 -> 0x391, 0x342)
  if (chr == 0x1FB6) return 0x0342;
  // ᾷ -> Α͂Ι (U+1FB7 -> 0x391, 0x342, 0x399) - 3 chars
  if (chr == 0x1FB7) return 0x03990342;
  // ᾼ -> ΑΙ (U+1FBC -> 0x391, 0x399)
  if (chr == 0x1FBC) return 0x0399;

  // ῂ -> ῊΙ (U+1FC2 -> 0x1FCA, 0x399)
  if (chr == 0x1FC2) return 0x0399;
  // ῃ -> ΗΙ (U+1FC3 -> 0x397, 0x399)
  if (chr == 0x1FC3) return 0x0399;
  // ῄ -> ΉΙ (U+1FC4 -> 0x389, 0x399)
  if (chr == 0x1FC4) return 0x0399;
  // ῆ -> Η͂ (U+1FC6 -> 0x397, 0x342)
  if (chr == 0x1FC6) return 0x0342;
  // ῇ -> Η͂Ι (U+1FC7 -> 0x397, 0x342, 0x399) - 3 chars
  if (chr == 0x1FC7) return 0x03990342;
  // ῌ -> ΗΙ (U+1FCC -> 0x397, 0x399)
  if (chr == 0x1FCC) return 0x0399;

  // ῒ -> Ϊ̀ (U+1FD2 -> 0x399, 0x308, 0x300) - 3 chars
  if (chr == 0x1FD2) return 0x03000308;
  // ΐ -> Ϊ́ (U+1FD3 -> 0x399, 0x308, 0x301) - 3 chars
  if (chr == 0x1FD3) return 0x03010308;
  // ῖ -> Ι͂ (U+1FD6 -> 0x399, 0x342)
  if (chr == 0x1FD6) return 0x0342;
  // ῗ -> Ϊ͂ (U+1FD7 -> 0x399, 0x308, 0x342) - 3 chars
  if (chr == 0x1FD7) return 0x03420308;

  // ῢ -> Ϋ̀ (U+1FE2 -> 0x3A5, 0x308, 0x300) - 3 chars
  if (chr == 0x1FE2) return 0x03000308;
  // ΰ -> Ϋ́ (U+1FE3 -> 0x3A5, 0x308, 0x301) - 3 chars
  if (chr == 0x1FE3) return 0x03010308;
  // ῤ -> Ρ̓ (U+1FE4 -> 0x3A1, 0x313)
  if (chr == 0x1FE4) return 0x0313;
  // ῦ -> Υ͂ (U+1FE6 -> 0x3A5, 0x342)
  if (chr == 0x1FE6) return 0x0342;
  // ῧ -> Ϋ͂ (U+1FE7 -> 0x3A5, 0x308, 0x342) - 3 chars
  if (chr == 0x1FE7) return 0x03420308;

  // ῲ -> ῺΙ (U+1FF2 -> 0x1FFA, 0x399)
  if (chr == 0x1FF2) return 0x0399;
  // ῳ -> ΩΙ (U+1FF3 -> 0x3A9, 0x399)
  if (chr == 0x1FF3) return 0x0399;
  // ῴ -> ΏΙ (U+1FF4 -> 0x38F, 0x399)
  if (chr == 0x1FF4) return 0x0399;
  // ῶ -> Ω͂ (U+1FF6 -> 0x3A9, 0x342)
  if (chr == 0x1FF6) return 0x0342;
  // ῷ -> Ω͂Ι (U+1FF7 -> 0x3A9, 0x342, 0x399) - 3 chars
  if (chr == 0x1FF7) return 0x03990342;
  // ῼ -> ΩΙ (U+1FFC -> 0x3A9, 0x399)
  if (chr == 0x1FFC) return 0x0399;

  // Ligatures (U+FB00-FB06)
  if (chr == 0xFB00) return 0x0046; // ff -> FF (extra F)
  if (chr == 0xFB01) return 0x0049; // fi -> FI (extra I)
  if (chr == 0xFB02) return 0x004C; // fl -> FL (extra L)
  if (chr == 0xFB03) return 0x00460049; // ffi -> FFI (extra FI) - 3 chars
  if (chr == 0xFB04) return 0x0046004C; // ffl -> FFL (extra FL) - 3 chars
  if (chr == 0xFB05) return 0x0054; // ſt -> ST (extra T)
  if (chr == 0xFB06) return 0x0054; // st -> ST (extra T)

  // Armenian ligatures (U+FB13-FB17)
  if (chr == 0xFB13) return 0x0546; // մdelays -> ՄՆ
  if (chr == 0xFB14) return 0x0535; // մdelays -> delays
  if (chr == 0xFB15) return 0x053B; // delays -> delays
  if (chr == 0xFB16) return 0x0546; // delays -> delays
  if (chr == 0xFB17) return 0x053D; // delays -> delays

  return 0;
};

// Helper to get uppercase code point (handles first char of multi-char mappings too)
export const __Porffor_uppercase = (chr: i32): i32 => {
  // ASCII lowercase a-z -> A-Z
  if (chr >= 97 && chr <= 122) return chr - 32;

  // Multi-char mapping first characters
  if (chr == 0x00DF) return 0x0053; // ß -> SS
  if (chr == 0x0149) return 0x02BC; // ʼn -> ʼN
  if (chr == 0x01F0) return 0x004A; // ǰ -> J̌
  if (chr == 0x0390) return 0x0399; // ΐ -> Ϊ́
  if (chr == 0x03B0) return 0x03A5; // ΰ -> Ϋ́
  if (chr == 0x0587) return 0x0535; // և -> ԵՒ
  if (chr == 0x1E96) return 0x0048; // ẖ -> H̱
  if (chr == 0x1E97) return 0x0054; // ẗ -> T̈
  if (chr == 0x1E98) return 0x0057; // ẘ -> W̊
  if (chr == 0x1E99) return 0x0059; // ẙ -> Y̊
  if (chr == 0x1E9A) return 0x0041; // ẚ -> Aʾ
  if (chr == 0x1F50) return 0x03A5; // ὐ -> Υ̓
  if (chr == 0x1F52) return 0x03A5; // ὒ -> Υ̓̀
  if (chr == 0x1F54) return 0x03A5; // ὔ -> Υ̓́
  if (chr == 0x1F56) return 0x03A5; // ὖ -> Υ̓͂

  // Greek Extended with iota subscript (U+1F80-1F8F) -> base uppercase + Ι
  if (chr >= 0x1F80 && chr <= 0x1F87) return 0x1F08 + (chr - 0x1F80);
  if (chr >= 0x1F88 && chr <= 0x1F8F) return 0x1F08 + (chr - 0x1F88);
  if (chr >= 0x1F90 && chr <= 0x1F97) return 0x1F28 + (chr - 0x1F90);
  if (chr >= 0x1F98 && chr <= 0x1F9F) return 0x1F28 + (chr - 0x1F98);
  if (chr >= 0x1FA0 && chr <= 0x1FA7) return 0x1F68 + (chr - 0x1FA0);
  if (chr >= 0x1FA8 && chr <= 0x1FAF) return 0x1F68 + (chr - 0x1FA8);

  if (chr == 0x1FB2) return 0x1FBA; // ᾲ -> ᾺΙ
  if (chr == 0x1FB3) return 0x0391; // ᾳ -> ΑΙ
  if (chr == 0x1FB4) return 0x0386; // ᾴ -> ΆΙ
  if (chr == 0x1FB6) return 0x0391; // ᾶ -> Α͂
  if (chr == 0x1FB7) return 0x0391; // ᾷ -> Α͂Ι
  if (chr == 0x1FBC) return 0x0391; // ᾼ -> ΑΙ

  if (chr == 0x1FC2) return 0x1FCA; // ῂ -> ῊΙ
  if (chr == 0x1FC3) return 0x0397; // ῃ -> ΗΙ
  if (chr == 0x1FC4) return 0x0389; // ῄ -> ΉΙ
  if (chr == 0x1FC6) return 0x0397; // ῆ -> Η͂
  if (chr == 0x1FC7) return 0x0397; // ῇ -> Η͂Ι
  if (chr == 0x1FCC) return 0x0397; // ῌ -> ΗΙ

  if (chr == 0x1FD2) return 0x0399; // ῒ -> Ϊ̀
  if (chr == 0x1FD3) return 0x0399; // ΐ -> Ϊ́
  if (chr == 0x1FD6) return 0x0399; // ῖ -> Ι͂
  if (chr == 0x1FD7) return 0x0399; // ῗ -> Ϊ͂

  if (chr == 0x1FE2) return 0x03A5; // ῢ -> Ϋ̀
  if (chr == 0x1FE3) return 0x03A5; // ΰ -> Ϋ́
  if (chr == 0x1FE4) return 0x03A1; // ῤ -> Ρ̓
  if (chr == 0x1FE6) return 0x03A5; // ῦ -> Υ͂
  if (chr == 0x1FE7) return 0x03A5; // ῧ -> Ϋ͂

  if (chr == 0x1FF2) return 0x1FFA; // ῲ -> ῺΙ
  if (chr == 0x1FF3) return 0x03A9; // ῳ -> ΩΙ
  if (chr == 0x1FF4) return 0x038F; // ῴ -> ΏΙ
  if (chr == 0x1FF6) return 0x03A9; // ῶ -> Ω͂
  if (chr == 0x1FF7) return 0x03A9; // ῷ -> Ω͂Ι
  if (chr == 0x1FFC) return 0x03A9; // ῼ -> ΩΙ

  // Ligatures
  if (chr == 0xFB00) return 0x0046; // ff -> FF
  if (chr == 0xFB01) return 0x0046; // fi -> FI
  if (chr == 0xFB02) return 0x0046; // fl -> FL
  if (chr == 0xFB03) return 0x0046; // ffi -> FFI
  if (chr == 0xFB04) return 0x0046; // ffl -> FFL
  if (chr == 0xFB05) return 0x0053; // ſt -> ST
  if (chr == 0xFB06) return 0x0053; // st -> ST

  // Armenian ligatures
  if (chr == 0xFB13) return 0x0544; // մdelays -> ՄՆ
  if (chr == 0xFB14) return 0x0544; // մdelays -> ՄԵ
  if (chr == 0xFB15) return 0x0544; // մdelays -> ՄԻ
  if (chr == 0xFB16) return 0x054E; // delays -> ՎՆ
  if (chr == 0xFB17) return 0x0544; // delays -> ՄԽ

  // Latin Extended-A/B and others with -1 alternating pattern
  // (many lowercase chars are odd, uppercase are even)
  if (chr >= 0x100 && chr <= 0x12f) {
    if (chr % 2 == 1) return chr - 1;
    return chr;
  }
  if (chr >= 0x132 && chr <= 0x137) {
    if (chr % 2 == 1) return chr - 1;
    return chr;
  }
  if (chr >= 0x139 && chr <= 0x148) {
    if (chr % 2 == 0) return chr - 1;
    return chr;
  }
  if (chr >= 0x14a && chr <= 0x177) {
    if (chr % 2 == 1) return chr - 1;
    return chr;
  }
  if (chr >= 0x179 && chr <= 0x17e) {
    if (chr % 2 == 0) return chr - 1;
    return chr;
  }
  if (chr >= 0x182 && chr <= 0x185) {
    if (chr % 2 == 1) return chr - 1;
    return chr;
  }

  // Latin Extended-B
  if (chr >= 0x1a0 && chr <= 0x1a5) {
    if (chr % 2 == 1) return chr - 1;
    return chr;
  }
  if (chr >= 0x1cd && chr <= 0x1dc) {
    if (chr % 2 == 0) return chr - 1;
    return chr;
  }
  if (chr >= 0x1de && chr <= 0x1ef) {
    if (chr % 2 == 1) return chr - 1;
    return chr;
  }
  if (chr >= 0x1f8 && chr <= 0x21f) {
    if (chr % 2 == 1) return chr - 1;
    return chr;
  }
  if (chr >= 0x222 && chr <= 0x233) {
    if (chr % 2 == 1) return chr - 1;
    return chr;
  }

  // Latin Extended Additional
  if (chr >= 0x1e00 && chr <= 0x1e95) {
    if (chr % 2 == 1) return chr - 1;
    return chr;
  }
  if (chr >= 0x1ea0 && chr <= 0x1ef9) {
    if (chr % 2 == 1) return chr - 1;
    return chr;
  }

  // Latin Extended-A: 0xe0-0xf6 and 0xf8-0xfe -> subtract 32
  if (chr >= 0xe0 && chr <= 0xf6) return chr - 32;
  if (chr >= 0xf8 && chr <= 0xfe) return chr - 32;

  // Special Latin-1 cases
  if (chr == 0x00B5) return 0x039C; // µ micro sign -> Μ Greek capital mu
  if (chr == 0x00FF) return 0x0178; // ÿ -> Ÿ

  // Greek lowercase -> uppercase
  if (chr >= 0x3b1 && chr <= 0x3c1) return chr - 32;
  if (chr >= 0x3c3 && chr <= 0x3cb) return chr - 32;

  // Cyrillic lowercase -> uppercase
  if (chr >= 0x430 && chr <= 0x44f) return chr - 32;
  if (chr >= 0x450 && chr <= 0x45f) return chr - 80;

  // Fullwidth lowercase a-z
  if (chr >= 0xff41 && chr <= 0xff5a) return chr - 32;

  // Table lookup for special cases
  const tableResult: i32 = __Porffor_uppercase_table(chr);
  if (tableResult != -1) return tableResult;

  return chr;
};

// Helper to get extra lowercase chars for multi-char mappings
// Only U+0130 (İ) has a multi-char lowercase: i + combining dot above
export const __Porffor_lowercase_extra = (chr: i32): i32 => {
  if (chr == 0x0130) return 0x0307; // İ -> i + combining dot above
  return 0;
};

// Helper to get lowercase code point (handles first char of multi-char mappings too)
export const __Porffor_lowercase = (chr: i32): i32 => {
  // U+0130 İ -> i (+ combining dot above handled separately)
  if (chr == 0x0130) return 0x0069;

  // Table lookup for special cases
  const tableResult: i32 = __Porffor_lowercase_table(chr);
  if (tableResult != -1) return tableResult;

  // ASCII uppercase A-Z -> a-z
  if (chr >= 65 && chr <= 90) return chr + 32;

  // Latin Extended-A/B with +1 alternating pattern
  if (chr >= 0x100 && chr <= 0x12f) {
    if (chr % 2 == 0) return chr + 1;
    return chr;
  }
  if (chr >= 0x132 && chr <= 0x137) {
    if (chr % 2 == 0) return chr + 1;
    return chr;
  }
  if (chr >= 0x139 && chr <= 0x148) {
    if (chr % 2 == 1) return chr + 1;
    return chr;
  }
  if (chr >= 0x14a && chr <= 0x177) {
    if (chr % 2 == 0) return chr + 1;
    return chr;
  }
  if (chr >= 0x179 && chr <= 0x17e) {
    if (chr % 2 == 1) return chr + 1;
    return chr;
  }
  if (chr >= 0x182 && chr <= 0x185) {
    if (chr % 2 == 0) return chr + 1;
    return chr;
  }

  // Latin Extended-B
  if (chr >= 0x1a0 && chr <= 0x1a5) {
    if (chr % 2 == 0) return chr + 1;
    return chr;
  }
  if (chr >= 0x1cd && chr <= 0x1dc) {
    if (chr % 2 == 1) return chr + 1;
    return chr;
  }
  if (chr >= 0x1de && chr <= 0x1ef) {
    if (chr % 2 == 0) return chr + 1;
    return chr;
  }
  if (chr >= 0x1f8 && chr <= 0x21f) {
    if (chr % 2 == 0) return chr + 1;
    return chr;
  }
  if (chr >= 0x222 && chr <= 0x233) {
    if (chr % 2 == 0) return chr + 1;
    return chr;
  }

  // Latin Extended Additional
  if (chr >= 0x1e00 && chr <= 0x1e95) {
    if (chr % 2 == 0) return chr + 1;
    return chr;
  }
  if (chr >= 0x1ea0 && chr <= 0x1ef9) {
    if (chr % 2 == 0) return chr + 1;
    return chr;
  }

  // Latin Extended-A: 0xc0-0xd6 and 0xd8-0xde -> add 32
  if (chr >= 0xc0 && chr <= 0xd6) return chr + 32;
  if (chr >= 0xd8 && chr <= 0xde) return chr + 32;

  // Greek uppercase -> lowercase
  if (chr >= 0x391 && chr <= 0x3a1) return chr + 32;
  if (chr >= 0x3a3 && chr <= 0x3ab) return chr + 32;

  // Cyrillic uppercase -> lowercase
  if (chr >= 0x410 && chr <= 0x42f) return chr + 32;
  if (chr >= 0x400 && chr <= 0x40f) return chr + 80;

  // Fullwidth uppercase A-Z
  if (chr >= 0xff21 && chr <= 0xff3a) return chr + 32;

  return chr;
};

export const __String_prototype_toUpperCase = (_this: any) => {
  // 1. Let O be ? RequireObjectCoercible(this value).
  const t: i32 = Porffor.type(_this);
  if (Porffor.fastOr(t == Porffor.TYPES.undefined, t == Porffor.TYPES.object && _this === null)) {
    throw new TypeError('String.prototype.toUpperCase requires that this not be null or undefined');
  }

  // 2. Let S be ? ToString(O).
  if (Porffor.fastAnd(t != Porffor.TYPES.string, t != Porffor.TYPES.bytestring)) {
    _this = ecma262.ToString(_this);
  }

  // Handle ByteString (1-byte chars) - may need wide string output
  if (Porffor.type(_this) == Porffor.TYPES.bytestring) {
    const len: i32 = _this.length;

    // First pass: count ß characters and check if we need wide string
    let extraChars: i32 = 0;
    let needWide: boolean = false;
    let i: i32 = Porffor.wasm`local.get ${_this}`;
    const endPtr: i32 = i + len;

    while (i < endPtr) {
      const chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);
      if (chr == 0xDF) extraChars++;
      const upper: i32 = __Porffor_uppercase(chr);
      if (upper > 0xFF) needWide = true;
    }

    if (needWide) {
      let out: string = Porffor.malloc();
      Porffor.wasm.i32.store(out, len + extraChars, 0, 0);

      i = Porffor.wasm`local.get ${_this}`;
      let j: i32 = Porffor.wasm`local.get ${out}`;

      while (i < endPtr) {
        const chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);
        const upper: i32 = __Porffor_uppercase(chr);
        Porffor.wasm.i32.store16(j, upper, 0, 4);
        j += 2;
        if (chr == 0xDF) {
          Porffor.wasm.i32.store16(j, 0x53, 0, 4);
          j += 2;
        }
      }
      return out;
    }

    // Can stay as ByteString
    let out: bytestring = Porffor.malloc();
    Porffor.wasm.i32.store(out, len + extraChars, 0, 0);

    i = Porffor.wasm`local.get ${_this}`;
    let j: i32 = Porffor.wasm`local.get ${out}`;

    while (i < endPtr) {
      const chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);
      const upper: i32 = __Porffor_uppercase(chr);
      Porffor.wasm.i32.store8(j++, upper, 0, 4);
      if (chr == 0xDF) {
        Porffor.wasm.i32.store8(j++, 0x53, 0, 4);
      }
    }
    return out;
  }

  const len: i32 = _this.length;

  // First pass: calculate output length
  let outLen: i32 = 0;
  let i: i32 = Porffor.wasm`local.get ${_this}`;
  const endPtr: i32 = i + len * 2;

  while (i < endPtr) {
    let chr: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
    i += 2;

    outLen++;
    const extra: i32 = __Porffor_uppercase_extra(chr);
    if (extra != 0) {
      outLen++; // second char
      if (extra > 0xFFFF) outLen++; // third char if packed
    }
  }

  let out: string = Porffor.malloc();
  Porffor.wasm.i32.store(out, outLen, 0, 0);

  // Second pass: write output
  i = Porffor.wasm`local.get ${_this}`;
  let j: i32 = Porffor.wasm`local.get ${out}`;

  while (i < endPtr) {
    let chr: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
    i += 2;

    const upper: i32 = __Porffor_uppercase(chr);
    Porffor.wasm.i32.store16(j, upper, 0, 4);
    j += 2;

    const extra: i32 = __Porffor_uppercase_extra(chr);
    if (extra != 0) {
      if (extra > 0xFFFF) {
        // 3-char mapping: extra has (char3 << 16) | char2
        Porffor.wasm.i32.store16(j, extra & 0xFFFF, 0, 4);
        j += 2;
        Porffor.wasm.i32.store16(j, extra >> 16, 0, 4);
        j += 2;
      } else {
        // 2-char mapping
        Porffor.wasm.i32.store16(j, extra, 0, 4);
        j += 2;
      }
    }
  }

  return out;
};

export const __ByteString_prototype_toUpperCase = (_this: bytestring) => {
  const len: i32 = _this.length;

  // First pass: count ß characters and check if we need wide string
  let extraChars: i32 = 0;
  let needWide: boolean = false;
  let i: i32 = Porffor.wasm`local.get ${_this}`;
  const endPtr: i32 = i + len;

  while (i < endPtr) {
    const chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);
    if (chr == 0xDF) extraChars++;
    // Check if uppercase would exceed 0xFF (µ->Μ, ÿ->Ÿ, etc.)
    const upper: i32 = __Porffor_uppercase(chr);
    if (upper > 0xFF) needWide = true;
  }

  if (needWide) {
    // Need to use String (UTF-16) output
    let out: string = Porffor.malloc();
    Porffor.wasm.i32.store(out, len + extraChars, 0, 0);

    i = Porffor.wasm`local.get ${_this}`;
    let j: i32 = Porffor.wasm`local.get ${out}`;

    while (i < endPtr) {
      let chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);

      if (chr == 0xDF) {
        // ß -> SS
        Porffor.wasm.i32.store16(j, 0x53, 0, 4);
        j += 2;
        Porffor.wasm.i32.store16(j, 0x53, 0, 4);
        j += 2;
      } else {
        chr = __Porffor_uppercase(chr);
        Porffor.wasm.i32.store16(j, chr, 0, 4);
        j += 2;
      }
    }

    return out;
  }

  let out: bytestring = Porffor.malloc();
  Porffor.wasm.i32.store(out, len + extraChars, 0, 0);

  // Second pass: write output
  i = Porffor.wasm`local.get ${_this}`;
  let j: i32 = Porffor.wasm`local.get ${out}`;

  while (i < endPtr) {
    let chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);

    if (chr == 0xDF) {
      // ß -> SS
      Porffor.wasm.i32.store8(j++, 0x53, 0, 4);
      Porffor.wasm.i32.store8(j++, 0x53, 0, 4);
    } else {
      chr = __Porffor_uppercase(chr);
      Porffor.wasm.i32.store8(j++, chr, 0, 4);
    }
  }

  return out;
};

export const __String_prototype_toLowerCase = (_this: any) => {
  // 1. Let O be ? RequireObjectCoercible(this value).
  const t: i32 = Porffor.type(_this);
  if (Porffor.fastOr(t == Porffor.TYPES.undefined, t == Porffor.TYPES.object && _this === null)) {
    throw new TypeError('String.prototype.toLowerCase requires that this not be null or undefined');
  }

  // 2. Let S be ? ToString(O).
  if (Porffor.fastAnd(t != Porffor.TYPES.string, t != Porffor.TYPES.bytestring)) {
    _this = ecma262.ToString(_this);
  }

  // Handle ByteString (1-byte chars)
  if (Porffor.type(_this) == Porffor.TYPES.bytestring) {
    const len: i32 = _this.length;
    let out: bytestring = Porffor.malloc();
    Porffor.wasm.i32.store(out, len, 0, 0);

    let i: i32 = Porffor.wasm`local.get ${_this}`,
        j: i32 = Porffor.wasm`local.get ${out}`;

    const endPtr: i32 = i + len;
    while (i < endPtr) {
      let chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);
      chr = __Porffor_lowercase(chr);
      Porffor.wasm.i32.store8(j++, chr, 0, 4);
    }

    return out;
  }

  const len: i32 = _this.length;

  // First pass: calculate output length (only U+0130 has multi-char lowercase)
  let outLen: i32 = 0;
  let i: i32 = Porffor.wasm`local.get ${_this}`;
  const endPtr: i32 = i + len * 2;

  while (i < endPtr) {
    let chr: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
    i += 2;

    outLen++;
    if (chr == 0x0130) outLen++; // İ -> i + combining dot
  }

  let out: string = Porffor.malloc();
  Porffor.wasm.i32.store(out, outLen, 0, 0);

  // Second pass: write output
  i = Porffor.wasm`local.get ${_this}`;
  let j: i32 = Porffor.wasm`local.get ${out}`;

  while (i < endPtr) {
    let chr: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
    i += 2;

    const lower: i32 = __Porffor_lowercase(chr);
    Porffor.wasm.i32.store16(j, lower, 0, 4);
    j += 2;

    const extra: i32 = __Porffor_lowercase_extra(chr);
    if (extra != 0) {
      Porffor.wasm.i32.store16(j, extra, 0, 4);
      j += 2;
    }
  }

  return out;
};

export const __ByteString_prototype_toLowerCase = (_this: bytestring) => {
  const len: i32 = _this.length;

  let out: bytestring = Porffor.malloc();
  Porffor.wasm.i32.store(out, len, 0, 0);

  let i: i32 = Porffor.wasm`local.get ${_this}`,
      j: i32 = Porffor.wasm`local.get ${out}`;

  const endPtr: i32 = i + len;
  while (i < endPtr) {
    let chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);

    chr = __Porffor_lowercase(chr);

    Porffor.wasm.i32.store8(j++, chr, 0, 4);
  }

  return out;
};

export const __String_prototype_toLocaleUpperCase = (_this: string) => __String_prototype_toUpperCase(_this);
export const __ByteString_prototype_toLocaleUpperCase = (_this: bytestring) => __ByteString_prototype_toUpperCase(_this);
export const __String_prototype_toLocaleLowerCase = (_this: string) => __String_prototype_toLowerCase(_this);
export const __ByteString_prototype_toLocaleLowerCase = (_this: bytestring) => __ByteString_prototype_toLowerCase(_this);

export const __String_prototype_codePointAt = (_this: string, index: any) => {
  index = ecma262.ToIntegerOrInfinity(index);

  const len: i32 = _this.length;

  if (Porffor.fastOr(index < 0, index >= len)) return undefined;

  index *= 2;
  const c1: i32 = Porffor.wasm.i32.load16_u(Porffor.wasm`local.get ${_this}` + index, 0, 4);
  if (Porffor.fastAnd(c1 >= 0xD800, c1 <= 0xDBFF)) {
    // 1st char is leading surrogate, handle 2nd char
    // check oob
    if (index + 1 >= len) return c1;

    const c2: i32 = Porffor.wasm.i32.load16_u(Porffor.wasm`local.get ${_this}` + index + 2, 0, 4);
    if (Porffor.fastAnd(c2 >= 0xDC00, c2 <= 0xDFFF)) {
      // 2nd char is trailing surrogate, return code point
      return (c1 << 10) + c2 - 56613888;
    }
  }

  return c1;
};

export const __ByteString_prototype_codePointAt = (_this: bytestring, index: any) => {
  index = ecma262.ToIntegerOrInfinity(index);

  const len: i32 = _this.length;

  if (Porffor.fastOr(index < 0, index >= len)) return undefined;

  // bytestrings cannot have surrogates, so just do charCodeAt
  return Porffor.wasm.i32.load8_u(Porffor.wasm`local.get ${_this}` + index, 0, 4);
};

export const __String_prototype_startsWith = (_this: string, _searchString: any, position: any = 0) => {
  // 4. Let isRegExp be IsRegExp(searchString).
  // 6. If isRegExp is true, throw a TypeError exception.
  if (Porffor.type(_searchString) == Porffor.TYPES.regexp) {
    throw new TypeError('First argument to String.prototype.startsWith must not be a regular expression');
  }

  // Convert to string after RegExp check
  const searchString: string = ecma262.ToString(_searchString);

  // todo/perf: investigate whether for counter vs while ++s are faster
  position = ecma262.ToIntegerOrInfinity(position);

  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;
  const searchPtr: i32 = Porffor.wasm`local.get ${searchString}`;

  // todo/perf: make position oob handling optional (via pref or fast variant?)
  const len: i32 = _this.length;
  if (position > 0) {
    if (position > len) position = len;
  } else position = 0;

  thisPtr += position * 2;

  const searchLen: i32 = searchString.length * 2;
  for (let i: i32 = 0; i < searchLen; i += 2) {
    let chr: i32 = Porffor.wasm.i32.load16_u(thisPtr + i, 0, 4);
    let expected: i32 = Porffor.wasm.i32.load16_u(searchPtr + i, 0, 4);

    if (chr != expected) return false;
  }

  return true;
};

export const __ByteString_prototype_startsWith = (_this: bytestring, _searchString: any, position: any = 0) => {
  // 4. Let isRegExp be IsRegExp(searchString).
  // 6. If isRegExp is true, throw a TypeError exception.
  if (Porffor.type(_searchString) == Porffor.TYPES.regexp) {
    throw new TypeError('First argument to String.prototype.startsWith must not be a regular expression');
  }

  // Convert to string (this will throw for Symbols)
  _searchString = ecma262.ToString(_searchString);

  // if searching non-bytestring, bytestring will not start with it
  if (Porffor.wasm`local.get ${_searchString+1}` != Porffor.TYPES.bytestring) return false;

  const searchString: bytestring = _searchString;

  // todo/perf: investigate whether for counter vs while ++s are faster
  position = ecma262.ToIntegerOrInfinity(position);

  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;
  const searchPtr: i32 = Porffor.wasm`local.get ${searchString}`;

  // todo/perf: make position oob handling optional (via pref or fast variant?)
  const len: i32 = _this.length;
  if (position > 0) {
    if (position > len) position = len;
  } else position = 0;

  thisPtr += position;

  const searchLen: i32 = searchString.length;
  for (let i: i32 = 0; i < searchLen; i++) {
    let chr: i32 = Porffor.wasm.i32.load8_u(thisPtr + i, 0, 4);
    let expected: i32 = Porffor.wasm.i32.load8_u(searchPtr + i, 0, 4);

    if (chr != expected) return false;
  }

  return true;
};


export const __String_prototype_endsWith = (_this: string, _searchString: any, endPosition: any = undefined) => {
  // 4. Let isRegExp be IsRegExp(searchString).
  // 6. If isRegExp is true, throw a TypeError exception.
  if (Porffor.type(_searchString) == Porffor.TYPES.regexp) {
    throw new TypeError('First argument to String.prototype.endsWith must not be a regular expression');
  }

  // Convert to string after RegExp check
  const searchString: string = ecma262.ToString(_searchString);

  let i: i32 = Porffor.wasm`local.get ${_this}`,
      j: i32 = Porffor.wasm`local.get ${searchString}`;

  const searchLen: i32 = searchString.length;

  // todo/perf: make position oob handling optional (via pref or fast variant?)
  const len: i32 = _this.length;

  // If endPosition is undefined, let pos be len; else let pos be ? ToIntegerOrInfinity(endPosition).
  if (Porffor.wasm`local.get ${endPosition+1}` == Porffor.TYPES.undefined) endPosition = len;
  else endPosition = ecma262.ToIntegerOrInfinity(endPosition);

  if (endPosition > 0) {
    if (endPosition > len) endPosition = len;
  } else endPosition = 0;

  endPosition -= searchLen;

  if (endPosition < 0) return false;

  i += endPosition * 2;

  const endPtr: i32 = j + searchLen * 2;
  while (j < endPtr) {
    let chr: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
    let expected: i32 = Porffor.wasm.i32.load16_u(j, 0, 4);

    i += 2;
    j += 2;

    if (chr != expected) return false;
  }

  return true;
};

export const __ByteString_prototype_endsWith = (_this: bytestring, _searchString: any, endPosition: any = undefined) => {
  // 4. Let isRegExp be IsRegExp(searchString).
  // 6. If isRegExp is true, throw a TypeError exception.
  if (Porffor.type(_searchString) == Porffor.TYPES.regexp) {
    throw new TypeError('First argument to String.prototype.endsWith must not be a regular expression');
  }

  // Convert to string (this will throw for Symbols)
  _searchString = ecma262.ToString(_searchString);

  // if searching non-bytestring, bytestring will not end with it
  if (Porffor.wasm`local.get ${_searchString+1}` != Porffor.TYPES.bytestring) return false;

  const searchString: bytestring = _searchString;

  let i: i32 = Porffor.wasm`local.get ${_this}`,
      j: i32 = Porffor.wasm`local.get ${searchString}`;

  const searchLen: i32 = searchString.length;

  // todo/perf: make position oob handling optional (via pref or fast variant?)
  const len: i32 = _this.length;

  // If endPosition is undefined, let pos be len; else let pos be ? ToIntegerOrInfinity(endPosition).
  if (Porffor.wasm`local.get ${endPosition+1}` == Porffor.TYPES.undefined) endPosition = len;
  else endPosition = ecma262.ToIntegerOrInfinity(endPosition);

  if (endPosition > 0) {
    if (endPosition > len) endPosition = len;
  } else endPosition = 0;

  endPosition -= searchLen;

  if (endPosition < 0) return false;

  i += endPosition;

  const endPtr: i32 = j + searchLen;
  while (j < endPtr) {
    let chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);
    let expected: i32 = Porffor.wasm.i32.load8_u(j++, 0, 4);

    if (chr != expected) return false;
  }

  return true;
};


// indexOf implementations moved to string_f64.ts for proper NaN/Infinity support

export const __String_prototype_lastIndexOf = (_this: string, searchString: any, position: any = undefined) => {
  searchString = ecma262.ToString(searchString);
  if (Porffor.wasm`local.get ${searchString+1}` == Porffor.TYPES.bytestring) {
    searchString = Porffor.bytestringToString(searchString);
  }

  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;
  const searchPtr: i32 = Porffor.wasm`local.get ${searchString}`;

  const searchLen: i32 = searchString.length;
  const searchLenX2: i32 = searchLen * 2;

  // todo/perf: make position oob handling optional (via pref or fast variant?)
  const len: i32 = _this.length;

  // endPosition ??= len;
  if (Porffor.wasm`local.get ${position+1}` == Porffor.TYPES.undefined) position = len - searchLen;

  if (position > 0) {
    const max: i32 = len - searchLen;
    if (position > max) position = max;
  } else position = 0;

  const thisPtrStart: i32 = thisPtr;

  thisPtr += position * 2;

  while (thisPtr >= thisPtrStart) {
    let match: boolean = true;
    for (let i: i32 = 0; i < searchLenX2; i += 2) {
      let chr: i32 = Porffor.wasm.i32.load8_u(thisPtr + i, 0, 4);
      let expected: i32 = Porffor.wasm.i32.load8_u(searchPtr + i, 0, 4);

      if (chr != expected) {
        match = false;
        break;
      }
    }

    if (match) return (thisPtr - Porffor.wasm`local.get ${_this}`) / 2;

    thisPtr -= 2;
  }

  return -1;
};

export const __ByteString_prototype_lastIndexOf = (_this: bytestring, searchString: any, position: any = undefined) => {
  searchString = ecma262.ToString(searchString);
  if (Porffor.wasm`local.get ${searchString+1}` != Porffor.TYPES.bytestring) {
    return __String_prototype_lastIndexOf(Porffor.bytestringToString(_this), searchString, position);
  }

  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;
  const searchPtr: i32 = Porffor.wasm`local.get ${searchString}`;

  const searchLen: i32 = searchString.length;

  // todo/perf: make position oob handling optional (via pref or fast variant?)
  const len: i32 = _this.length;

  // endPosition ??= len;
  if (Porffor.wasm`local.get ${position+1}` == Porffor.TYPES.undefined) position = len - searchLen;

  if (position > 0) {
    const max: i32 = len - searchLen;
    if (position > max) position = max;
  } else position = 0;

  const thisPtrStart: i32 = thisPtr;

  thisPtr += position;

  while (thisPtr >= thisPtrStart) {
    let match: boolean = true;
    for (let i: i32 = 0; i < searchLen; i++) {
      let chr: i32 = Porffor.wasm.i32.load8_u(thisPtr + i, 0, 4);
      let expected: i32 = Porffor.wasm.i32.load8_u(searchPtr + i, 0, 4);

      if (chr != expected) {
        match = false;
        break;
      }
    }

    if (match) return thisPtr - Porffor.wasm`local.get ${_this}`;

    thisPtr--;
  }

  return -1;
};


export const __String_prototype_includes = (_this: string, _searchString: any, position: any = 0) => {
  // 4. Let isRegExp be IsRegExp(searchString).
  // 6. If isRegExp is true, throw a TypeError exception.
  if (Porffor.type(_searchString) == Porffor.TYPES.regexp) {
    throw new TypeError('First argument to String.prototype.includes must not be a regular expression');
  }

  // Convert to string after RegExp check
  const searchString: string = ecma262.ToString(_searchString);

  position = ecma262.ToIntegerOrInfinity(position);

  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;
  const searchPtr: i32 = Porffor.wasm`local.get ${searchString}`;

  const searchLenX2: i32 = searchString.length * 2;

  // todo/perf: make position oob handling optional (via pref or fast variant?)
  const len: i32 = _this.length;
  if (position > 0) {
    if (position > len) position = len;
  } else position = 0;

  const thisPtrEnd: i32 = thisPtr + (len * 2) - searchLenX2;

  thisPtr += position * 2;

  while (thisPtr <= thisPtrEnd) {
    let match: boolean = true;
    for (let i: i32 = 0; i < searchLenX2; i += 2) {
      let chr: i32 = Porffor.wasm.i32.load16_u(thisPtr + i, 0, 4);
      let expected: i32 = Porffor.wasm.i32.load16_u(searchPtr + i, 0, 4);

      if (chr != expected) {
        match = false;
        break;
      }
    }

    if (match) return true;

    thisPtr += 2;
  }

  return false;
};

export const __ByteString_prototype_includes = (_this: bytestring, _searchString: any, position: any = 0) => {
  // 4. Let isRegExp be IsRegExp(searchString).
  // 6. If isRegExp is true, throw a TypeError exception.
  if (Porffor.type(_searchString) == Porffor.TYPES.regexp) {
    throw new TypeError('First argument to String.prototype.includes must not be a regular expression');
  }

  // Convert to string (this will throw for Symbols)
  _searchString = ecma262.ToString(_searchString);

  // if searching non-bytestring, bytestring will not include it
  if (Porffor.wasm`local.get ${_searchString+1}` != Porffor.TYPES.bytestring) return false;

  const searchString: bytestring = _searchString;

  // Let pos be ? ToIntegerOrInfinity(position).
  position = ecma262.ToIntegerOrInfinity(position);

  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;
  const searchPtr: i32 = Porffor.wasm`local.get ${searchString}`;

  const searchLen: i32 = searchString.length;

  // todo/perf: make position oob handling optional (via pref or fast variant?)
  const len: i32 = _this.length;
  if (position > 0) {
    if (position > len) position = len;
  } else position = 0;

  const thisPtrEnd: i32 = thisPtr + len - searchLen;

  thisPtr += position;

  while (thisPtr <= thisPtrEnd) {
    let match: boolean = true;
    for (let i: i32 = 0; i < searchLen; i++) {
      let chr: i32 = Porffor.wasm.i32.load8_u(thisPtr + i, 0, 4);
      let expected: i32 = Porffor.wasm.i32.load8_u(searchPtr + i, 0, 4);

      if (chr != expected) {
        match = false;
        break;
      }
    }

    if (match) return true;

    thisPtr++;
  }

  return false;
};

// padStart/padEnd moved to string_f64.ts because padString can be any value (e.g. NaN)
// which would be truncated to 0 in i32 mode

export const __String_prototype_substring = (_this: string, start: any, end: any) => {
  const len: i32 = _this.length;

  // Let intStart be ? ToIntegerOrInfinity(start).
  start = ecma262.ToIntegerOrInfinity(start);

  // If end is undefined, let intEnd be len; else let intEnd be ? ToIntegerOrInfinity(end).
  if (Porffor.wasm`local.get ${end+1}` == Porffor.TYPES.undefined) end = len;
  else {
    end = ecma262.ToIntegerOrInfinity(end);
    if (start > end) {
      const tmp: i32 = end;
      end = start;
      start = tmp;
    }
  }

  if (start < 0) start = 0;
  if (start > len) start = len;
  if (end < 0) end = 0;
  if (end > len) end = len;

  let out: string = Porffor.malloc();

  let outPtr: i32 = Porffor.wasm`local.get ${out}`;
  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;

  const thisPtrEnd: i32 = thisPtr + end * 2;

  thisPtr += start * 2;

  while (thisPtr < thisPtrEnd) {
    Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(thisPtr, 0, 4), 0, 4);

    thisPtr += 2;
    outPtr += 2;
  }

  out.length = end - start;

  return out;
};

export const __ByteString_prototype_substring = (_this: bytestring, start: any, end: any) => {
  const len: i32 = _this.length;

  // Let intStart be ? ToIntegerOrInfinity(start).
  start = ecma262.ToIntegerOrInfinity(start);

  // If end is undefined, let intEnd be len; else let intEnd be ? ToIntegerOrInfinity(end).
  if (Porffor.wasm`local.get ${end+1}` == Porffor.TYPES.undefined) end = len;
  else {
    end = ecma262.ToIntegerOrInfinity(end);
    if (start > end) {
      const tmp: i32 = end;
      end = start;
      start = tmp;
    }
  }

  if (start < 0) start = 0;
  if (start > len) start = len;
  if (end < 0) end = 0;
  if (end > len) end = len;

  let out: bytestring = Porffor.malloc();

  let outPtr: i32 = Porffor.wasm`local.get ${out}`;
  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;

  const thisPtrEnd: i32 = thisPtr + end;

  thisPtr += start;

  while (thisPtr < thisPtrEnd) {
    Porffor.wasm.i32.store8(outPtr++, Porffor.wasm.i32.load8_u(thisPtr++, 0, 4), 0, 4);
  }

  out.length = end - start;

  return out;
};


export const __String_prototype_substr = (_this: string, start: number, length: number) => {
  const len: i32 = _this.length;


  if (start < 0) {
    start = len + start;
    if (start < 0) start = 0;
  }

  if (Porffor.wasm`local.get ${length+1}` == Porffor.TYPES.undefined) length = len - start;


  if (start + length > len) length = len - start;

  let out: string = Porffor.malloc();

  let outPtr: i32 = Porffor.wasm`local.get ${out}`;
  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;

  thisPtr += start * 2;

  const thisPtrEnd: i32 = thisPtr + length * 2;

  while (thisPtr < thisPtrEnd) {
    Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(thisPtr, 0, 4), 0, 4);

    thisPtr += 2;
    outPtr += 2;
  }

  out.length = length;

  return out;
};

export const __ByteString_prototype_substr = (_this: bytestring, start: number, length: number) => {
  const len: i32 = _this.length;


  if (start < 0) {
    start = len + start;
    if (start < 0) start = 0;
  }

  if (Porffor.wasm`local.get ${length+1}` == Porffor.TYPES.undefined) length = len - start;


  if (start + length > len) length = len - start;

  let out: bytestring = Porffor.malloc();

  let outPtr: i32 = Porffor.wasm`local.get ${out}`;
  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;

  thisPtr += start;

  const thisPtrEnd: i32 = thisPtr + length;

  while (thisPtr < thisPtrEnd) {
    Porffor.wasm.i32.store8(outPtr++, Porffor.wasm.i32.load8_u(thisPtr++, 0, 4), 0, 4);
  }

  out.length = length;

  return out;
};


export const __String_prototype_slice = (_this: string, start: any, end: any) => {
  const len: i32 = _this.length;

  // Let intStart be ? ToIntegerOrInfinity(start).
  start = ecma262.ToIntegerOrInfinity(start);

  // If end is undefined, let intEnd be len; else let intEnd be ? ToIntegerOrInfinity(end).
  if (Porffor.wasm`local.get ${end+1}` == Porffor.TYPES.undefined) end = len;
  else end = ecma262.ToIntegerOrInfinity(end);

  if (start < 0) {
    start = len + start;
    if (start < 0) start = 0;
  }
  if (start > len) start = len;
  if (end < 0) {
    end = len + end;
    if (end < 0) end = 0;
  }
  if (end > len) end = len;

  let out: string = Porffor.malloc();

  if (start > end) return out;

  let outPtr: i32 = Porffor.wasm`local.get ${out}`;
  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;

  const thisPtrEnd: i32 = thisPtr + end * 2;

  thisPtr += start * 2;

  while (thisPtr < thisPtrEnd) {
    Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(thisPtr, 0, 4), 0, 4);

    thisPtr += 2;
    outPtr += 2;
  }

  out.length = end - start;

  return out;
};

export const __ByteString_prototype_slice = (_this: bytestring, start: any, end: any) => {
  const len: i32 = _this.length;

  // Let intStart be ? ToIntegerOrInfinity(start).
  start = ecma262.ToIntegerOrInfinity(start);

  // If end is undefined, let intEnd be len; else let intEnd be ? ToIntegerOrInfinity(end).
  if (Porffor.wasm`local.get ${end+1}` == Porffor.TYPES.undefined) end = len;
  else end = ecma262.ToIntegerOrInfinity(end);

  if (start < 0) {
    start = len + start;
    if (start < 0) start = 0;
  }
  if (start > len) start = len;
  if (end < 0) {
    end = len + end;
    if (end < 0) end = 0;
  }
  if (end > len) end = len;

  let out: bytestring = Porffor.malloc();

  if (start > end) return out;

  let outPtr: i32 = Porffor.wasm`local.get ${out}`;
  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;

  const thisPtrEnd: i32 = thisPtr + end;

  thisPtr += start;

  while (thisPtr < thisPtrEnd) {
    Porffor.wasm.i32.store8(outPtr++, Porffor.wasm.i32.load8_u(thisPtr++, 0, 4), 0, 4);
  }

  out.length = end - start;

  return out;
};


export const __String_prototype_concat = (_this: any, ...vals: any[]) => {
  const t: i32 = Porffor.type(_this);
  if (Porffor.fastOr(t == Porffor.TYPES.undefined, t == Porffor.TYPES.object && _this === null)) {
    throw new TypeError('String.prototype.concat called on null or undefined');
  }

  _this = ecma262.ToString(_this);

  let out: any = Porffor.malloc();
  Porffor.clone(_this, out);

  // copy _this type to out
  Porffor.wasm`
local.get ${_this+1}
local.set ${out+1}`;

  const valsLen: i32 = vals.length;
  for (let i: i32 = 0; i < valsLen; i++) {
    Porffor.wasm`
local.get ${out}
f64.convert_i32_u
local.get ${out+1}

local.get ${vals}
local.get ${i}
i32.const 9
i32.mul
i32.add
f64.load 0 4

local.get ${vals}
local.get ${i}
i32.const 9
i32.mul
i32.add
i32.load8_u 0 12

call __Porffor_concatStrings
local.set ${out+1}
i32.trunc_sat_f64_u
local.set ${out}`;
  }

  return out;
};

export const __ByteString_prototype_concat = (_this: bytestring, ...vals: any[]) => {
  let out: any = Porffor.malloc();
  Porffor.clone(_this, out);

  // copy _this type to out
  Porffor.wasm`
local.get ${_this+1}
local.set ${out+1}`;

  const valsLen: i32 = vals.length;
  for (let i: i32 = 0; i < valsLen; i++) {
    Porffor.wasm`
local.get ${out}
f64.convert_i32_u
local.get ${out+1}

local.get ${vals}
local.get ${i}
i32.const 9
i32.mul
i32.add
f64.load 0 4

local.get ${vals}
local.get ${i}
i32.const 9
i32.mul
i32.add
i32.load8_u 0 12

call __Porffor_concatStrings
local.set ${out+1}
i32.trunc_sat_f64_u
local.set ${out}`;
  }

  return out;
};

export const __String_prototype_localeCompare = (_this: string, compareString: any) => {
  compareString = ecma262.ToString(compareString);

  const thisLen: i32 = _this.length;
  const compareLen: i32 = compareString.length;
  const maxLen: i32 = thisLen > compareLen ? thisLen : compareLen;

  for (let i: i32 = 0; i < maxLen; i++) {
    const a: i32 = _this.charCodeAt(i);
    const b: i32 = compareString.charCodeAt(i);

    if (a > b) return 1;
    if (b > a) return -1;
  }

  if (thisLen > compareLen) return 1;
  if (compareLen > thisLen) return -1;

  return 0;
};

export const __ByteString_prototype_localeCompare = (_this: bytestring, compareString: any) => {
  compareString = ecma262.ToString(compareString);

  const thisLen: i32 = _this.length;
  const compareLen: i32 = compareString.length;
  const maxLen: i32 = thisLen > compareLen ? thisLen : compareLen;

  for (let i: i32 = 0; i < maxLen; i++) {
    const a: i32 = _this.charCodeAt(i);
    const b: i32 = compareString.charCodeAt(i);

    if (a > b) return 1;
    if (b > a) return -1;
  }

  if (thisLen > compareLen) return 1;
  if (compareLen > thisLen) return -1;

  return 0;
};


export const __String_prototype_isWellFormed = (_this: string) => {
  let ptr: i32 = Porffor.wasm`local.get ${_this}`;
  const endPtr: i32 = ptr + _this.length * 2;
  while (ptr < endPtr) {
    const c1: i32 = Porffor.wasm.i32.load16_u(ptr, 0, 4);

    if (Porffor.fastAnd(c1 >= 0xDC00, c1 <= 0xDFFF)) {
      // lone trailing surrogate, bad
      return false;
    }

    if (Porffor.fastAnd(c1 >= 0xD800, c1 <= 0xDBFF)) {
      // leading surrogate, peek if next is trailing
      const c2: i32 = ptr + 2 < endPtr ? Porffor.wasm.i32.load16_u(ptr + 2, 0, 4) : 0;

      if (Porffor.fastAnd(c2 >= 0xDC00, c2 <= 0xDFFF)) {
        // next is trailing surrogate, skip it too
        ptr += 2;
      } else {
        // lone leading surrogate, bad
        return false;
      }
    }

    ptr += 2;
  }

  return true;
};

export const __ByteString_prototype_isWellFormed = (_this: bytestring) => {
  // bytestrings cannot have surrogates, so always true
  return true;
};

export const __String_prototype_toWellFormed = (_this: string) => {
  let out: string = Porffor.malloc();
  Porffor.clone(_this, out);

  let ptr: i32 = Porffor.wasm`local.get ${out}`;
  const endPtr: i32 = ptr + out.length * 2;
  while (ptr < endPtr) {
    const c1: i32 = Porffor.wasm.i32.load16_u(ptr, 0, 4);

    if (Porffor.fastAnd(c1 >= 0xDC00, c1 <= 0xDFFF)) {
      // lone trailing surrogate, bad
      Porffor.wasm.i32.store16(ptr, 0xFFFD, 0, 4);
    }

    if (Porffor.fastAnd(c1 >= 0xD800, c1 <= 0xDBFF)) {
      // leading surrogate, peek if next is trailing
      const c2: i32 = ptr + 2 < endPtr ? Porffor.wasm.i32.load16_u(ptr + 2, 0, 4) : 0;

      if (Porffor.fastAnd(c2 >= 0xDC00, c2 <= 0xDFFF)) {
        // next is trailing surrogate, skip it too
        ptr += 2;
      } else {
        // lone leading surrogate, bad
        Porffor.wasm.i32.store16(ptr, 0xFFFD, 0, 4);
      }
    }

    ptr += 2;
  }

  return out;
};

export const __ByteString_prototype_toWellFormed = (_this: bytestring) => {
  // bytestrings cannot have surrogates, so just copy
  let out: bytestring = Porffor.malloc();
  Porffor.clone(_this, out);

  return out;
};


// 22.1.3.29 String.prototype.toString ()
// https://tc39.es/ecma262/#sec-string.prototype.tostring
export const __String_prototype_toString = (_this: string) => {
  // 1. Return ? ThisStringValue(this value).
  return _this;
};

export const __ByteString_prototype_toString = (_this: bytestring) => {
  // 1. Return ? ThisStringValue(this value).
  return _this;
};

export const __String_prototype_toLocaleString = (_this: string) => __String_prototype_toString(_this);
export const __ByteString_prototype_toLocaleString = (_this: bytestring) => __ByteString_prototype_toString(_this);

// 22.1.3.35 String.prototype.valueOf ()
// https://tc39.es/ecma262/#sec-string.prototype.valueof
export const __String_prototype_valueOf = (_this: string) => {
  // 1. Return ? ThisStringValue(this value).
  return _this;
};

export const __ByteString_prototype_valueOf = (_this: bytestring) => {
  // 1. Return ? ThisStringValue(this value).
  return _this;
};

// Helper: Calculate the length of a substituted replacement string at a given match position
// This handles $$, $&, $`, $' patterns
export const __Porffor_getSubstitutionLength = (
  replaceString: string, replaceLen: i32,
  searchLen: i32, position: i32, tailPos: i32, stringLen: i32
): i32 => {
  let length: i32 = 0;
  const replacePtr: i32 = Porffor.wasm`local.get ${replaceString}`;

  let r: i32 = 0;
  while (r < replaceLen) {
    const chr: i32 = Porffor.wasm.i32.load16_u(replacePtr + r * 2, 0, 4);
    if (chr == 36 && r + 1 < replaceLen) { // $
      const next: i32 = Porffor.wasm.i32.load16_u(replacePtr + (r + 1) * 2, 0, 4);
      if (next == 36) { // $$
        length++;
        r += 2;
      } else if (next == 38) { // $&
        length += searchLen;
        r += 2;
      } else if (next == 96) { // $`
        length += position;
        r += 2;
      } else if (next == 39) { // $'
        length += stringLen - tailPos;
        r += 2;
      } else {
        // Not a recognized pattern, keep the $
        length++;
        r++;
      }
    } else {
      length++;
      r++;
    }
  }
  return length;
};

// Helper: Perform substitution and write to output, returning new output pointer
export const __Porffor_doSubstitution = (
  outPtr: i32, replaceString: string, replaceLen: i32,
  _this: string, searchString: string, searchLen: i32,
  position: i32, tailPos: i32, stringLen: i32
): i32 => {
  const replacePtr: i32 = Porffor.wasm`local.get ${replaceString}`;
  const thisPtr: i32 = Porffor.wasm`local.get ${_this}`;
  const searchPtr: i32 = Porffor.wasm`local.get ${searchString}`;

  let r: i32 = 0;
  while (r < replaceLen) {
    const chr: i32 = Porffor.wasm.i32.load16_u(replacePtr + r * 2, 0, 4);
    if (chr == 36 && r + 1 < replaceLen) { // $
      const next: i32 = Porffor.wasm.i32.load16_u(replacePtr + (r + 1) * 2, 0, 4);
      if (next == 36) { // $$ -> $
        Porffor.wasm.i32.store16(outPtr, 36, 0, 4);
        outPtr += 2;
        r += 2;
      } else if (next == 38) { // $& -> matched string
        for (let s: i32 = 0; s < searchLen; s++) {
          Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(searchPtr + s * 2, 0, 4), 0, 4);
          outPtr += 2;
        }
        r += 2;
      } else if (next == 96) { // $` -> portion before match
        for (let s: i32 = 0; s < position; s++) {
          Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(thisPtr + s * 2, 0, 4), 0, 4);
          outPtr += 2;
        }
        r += 2;
      } else if (next == 39) { // $' -> portion after match
        for (let s: i32 = tailPos; s < stringLen; s++) {
          Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(thisPtr + s * 2, 0, 4), 0, 4);
          outPtr += 2;
        }
        r += 2;
      } else {
        // Not a recognized pattern, keep the $
        Porffor.wasm.i32.store16(outPtr, chr, 0, 4);
        outPtr += 2;
        r++;
      }
    } else {
      Porffor.wasm.i32.store16(outPtr, chr, 0, 4);
      outPtr += 2;
      r++;
    }
  }
  return outPtr;
};

// 22.1.3.19 String.prototype.replaceAll ( searchValue, replaceValue )
// https://tc39.es/ecma262/#sec-string.prototype.replaceall
export const __String_prototype_replaceAll = (_this: string, searchString: any, replaceString: any) => {
  // Convert to strings
  searchString = ecma262.ToString(searchString);
  replaceString = ecma262.ToString(replaceString);

  // Convert to same string type for comparison
  if (Porffor.wasm`local.get ${searchString+1}` == Porffor.TYPES.bytestring) {
    searchString = Porffor.bytestringToString(searchString);
  }
  if (Porffor.wasm`local.get ${replaceString+1}` == Porffor.TYPES.bytestring) {
    replaceString = Porffor.bytestringToString(replaceString);
  }

  const thisLen: i32 = _this.length;
  const searchLen: i32 = searchString.length;
  const replaceLen: i32 = replaceString.length;

  // Empty search string: insert replacement between every character
  if (searchLen == 0) {
    let out: string = Porffor.malloc();
    let outPtr: i32 = Porffor.wasm`local.get ${out}`;
    let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;
    const replacePtr: i32 = Porffor.wasm`local.get ${replaceString}`;

    // Insert replacement at start
    for (let r: i32 = 0; r < replaceLen; r++) {
      Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(replacePtr + r * 2, 0, 4), 0, 4);
      outPtr += 2;
    }

    for (let i: i32 = 0; i < thisLen; i++) {
      // Copy character
      Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(thisPtr, 0, 4), 0, 4);
      outPtr += 2;
      thisPtr += 2;

      // Insert replacement after each character
      for (let r: i32 = 0; r < replaceLen; r++) {
        Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(replacePtr + r * 2, 0, 4), 0, 4);
        outPtr += 2;
      }
    }

    out.length = thisLen + (thisLen + 1) * replaceLen;
    return out;
  }

  // First pass: count occurrences and calculate output length with substitutions
  let count: i32 = 0;
  let pos: i32 = 0;
  let outLen: i32 = 0;
  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;
  const searchPtr: i32 = Porffor.wasm`local.get ${searchString}`;
  const searchLenX2: i32 = searchLen * 2;

  let lastMatchEnd: i32 = 0;
  while (pos <= thisLen - searchLen) {
    let match: boolean = true;
    for (let j: i32 = 0; j < searchLenX2; j += 2) {
      if (Porffor.wasm.i32.load16_u(thisPtr + pos * 2 + j, 0, 4) != Porffor.wasm.i32.load16_u(searchPtr + j, 0, 4)) {
        match = false;
        break;
      }
    }
    if (match) {
      // Add length of non-matched portion before this match
      outLen += pos - lastMatchEnd;
      // Add substituted replacement length
      const tailPos: i32 = pos + searchLen;
      outLen += __Porffor_getSubstitutionLength(replaceString, replaceLen, searchLen, pos, tailPos, thisLen);
      lastMatchEnd = tailPos;
      count++;
      pos += searchLen;
    } else {
      pos++;
    }
  }
  // Add remaining portion after last match
  outLen += thisLen - lastMatchEnd;

  // If no matches, return original string
  if (count == 0) return _this;

  // Allocate output string
  let out: string = Porffor.malloc();

  let outPtr: i32 = Porffor.wasm`local.get ${out}`;

  pos = 0;
  while (pos < thisLen) {
    // Check for match at current position
    let match: boolean = true;
    if (pos <= thisLen - searchLen) {
      for (let j: i32 = 0; j < searchLenX2; j += 2) {
        if (Porffor.wasm.i32.load16_u(thisPtr + pos * 2 + j, 0, 4) != Porffor.wasm.i32.load16_u(searchPtr + j, 0, 4)) {
          match = false;
          break;
        }
      }
    } else {
      match = false;
    }

    if (match) {
      // Perform substitution
      const tailPos: i32 = pos + searchLen;
      outPtr = __Porffor_doSubstitution(outPtr, replaceString, replaceLen, _this, searchString, searchLen, pos, tailPos, thisLen);
      pos += searchLen;
    } else {
      // Copy original character
      Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(thisPtr + pos * 2, 0, 4), 0, 4);
      outPtr += 2;
      pos++;
    }
  }

  out.length = outLen;
  return out;
};

export const __ByteString_prototype_replaceAll = (_this: bytestring, searchString: any, replaceString: any) => {
  // Delegate to String version
  return __String_prototype_replaceAll(Porffor.bytestringToString(_this), ecma262.ToString(searchString), ecma262.ToString(replaceString));
};

export const __String_prototype_replace = (_this: string, searchValue: any, replaceValue: any) => {
  // Convert replaceValue to string (TODO: support function replaceValue)
  replaceValue = ecma262.ToString(replaceValue);

  // Convert searchValue to string
  searchValue = ecma262.ToString(searchValue);

  // Convert to same string type for comparison
  if (Porffor.wasm`local.get ${searchValue+1}` == Porffor.TYPES.bytestring) {
    searchValue = Porffor.bytestringToString(searchValue);
  }
  if (Porffor.wasm`local.get ${replaceValue+1}` == Porffor.TYPES.bytestring) {
    replaceValue = Porffor.bytestringToString(replaceValue);
  }

  const thisLen: i32 = _this.length;
  const searchLen: i32 = searchValue.length;
  const replaceLen: i32 = replaceValue.length;

  // Empty search string: insert replacement at start
  if (searchLen == 0) {
    let out: string = Porffor.malloc();
    let outPtr: i32 = Porffor.wasm`local.get ${out}`;
    let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;
    const replacePtr: i32 = Porffor.wasm`local.get ${replaceValue}`;

    // Insert replacement at start
    for (let r: i32 = 0; r < replaceLen; r++) {
      Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(replacePtr + r * 2, 0, 4), 0, 4);
      outPtr += 2;
    }

    // Copy all characters
    for (let i: i32 = 0; i < thisLen; i++) {
      Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(thisPtr, 0, 4), 0, 4);
      outPtr += 2;
      thisPtr += 2;
    }

    out.length = thisLen + replaceLen;
    return out;
  }

  // Find first occurrence
  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;
  const searchPtr: i32 = Porffor.wasm`local.get ${searchValue}`;
  const searchLenX2: i32 = searchLen * 2;

  let matchPos: i32 = -1;
  let pos: i32 = 0;
  while (pos <= thisLen - searchLen) {
    let match: boolean = true;
    for (let j: i32 = 0; j < searchLenX2; j += 2) {
      if (Porffor.wasm.i32.load16_u(thisPtr + pos * 2 + j, 0, 4) != Porffor.wasm.i32.load16_u(searchPtr + j, 0, 4)) {
        match = false;
        break;
      }
    }
    if (match) {
      matchPos = pos;
      break;
    }
    pos++;
  }

  // If no match, return original string
  if (matchPos == -1) return _this;

  // Calculate output length
  const tailPos: i32 = matchPos + searchLen;
  const substLen: i32 = __Porffor_getSubstitutionLength(replaceValue, replaceLen, searchLen, matchPos, tailPos, thisLen);
  const outLen: i32 = matchPos + substLen + (thisLen - tailPos);

  // Allocate output string
  let out: string = Porffor.malloc();
  let outPtr: i32 = Porffor.wasm`local.get ${out}`;

  // Copy characters before match
  for (let i: i32 = 0; i < matchPos; i++) {
    Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(thisPtr + i * 2, 0, 4), 0, 4);
    outPtr += 2;
  }

  // Perform substitution
  outPtr = __Porffor_doSubstitution(outPtr, replaceValue, replaceLen, _this, searchValue, searchLen, matchPos, tailPos, thisLen);

  // Copy characters after match
  for (let i: i32 = tailPos; i < thisLen; i++) {
    Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(thisPtr + i * 2, 0, 4), 0, 4);
    outPtr += 2;
  }

  out.length = outLen;
  return out;
};

export const __ByteString_prototype_replace = (_this: bytestring, searchValue: any, replaceValue: any) => {
  // Delegate to String version
  return __String_prototype_replace(Porffor.bytestringToString(_this), searchValue, replaceValue);
};