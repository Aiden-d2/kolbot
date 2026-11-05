import re,json,sys
def parse(path):
    txt=open(path,encoding='utf-8',errors='replace').read()
    txt=re.sub(r'//[^\n]*','',txt); txt=re.sub(r'/\*.*?\*/','',txt,flags=re.S)
    out={}
    for m in re.finditer(r'enum\s+(\w+)\s*(?::\s*\w+\s*)?\{(.*?)\};',txt,re.S):
        v=-1
        for item in m.group(2).split(','):
            item=item.strip()
            if not item: continue
            if '=' in item:
                n,e=[x.strip() for x in item.split('=',1)]
                try: v=int(eval(e,{},out))
                except Exception: v=out.get(e,v+1)
            else: n=item; v+=1
            out[n]=v
    return out
if __name__=='__main__':
    import glob
    d={}
    for f in sys.argv[1:]: d.update(parse(f))
    json.dump(d,open(sys.argv[0].replace('enums.py','enums.json'),'w'))
    print(len(d), d.get('LEVEL_DENOFEVIL'), d.get('LVLPREST_ACT1_CAVE_DEN_OF_EVIL_N'), d.get('LEVEL_CRYPT'))
